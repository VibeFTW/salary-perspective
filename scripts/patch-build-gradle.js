/**
 * Patches the Capacitor-generated android/app/build.gradle to:
 *   1. Load key.properties for release signing
 *   2. Add a signingConfigs.release block
 *   3. Wire the release buildType to use that signing config
 *   4. Set versionCode and versionName
 *
 * Usage:
 *   node patch-build-gradle.js \
 *     --gradle-file android/app/build.gradle \
 *     --version-code 1 \
 *     --version-name "1.0.0"
 */

const fs = require("fs");

// ---- Parse CLI args ----
const args = process.argv.slice(2);
function getArg(name) {
  const idx = args.indexOf(name);
  return idx !== -1 && args[idx + 1] ? args[idx + 1] : null;
}

const gradleFile = getArg("--gradle-file");
const versionCode = getArg("--version-code") || "1";
const versionName = getArg("--version-name") || "1.0.0";

if (!gradleFile) {
  console.error("Usage: node patch-build-gradle.js --gradle-file <path>");
  process.exit(1);
}

let content = fs.readFileSync(gradleFile, "utf8");

// ---- 1. Add keystore properties loader at the very top ----
const keystoreLoader = `// --- Auto-injected by docker build ---
def keystorePropertiesFile = rootProject.file("key.properties")
def keystoreProperties = new Properties()
if (keystorePropertiesFile.exists()) {
    keystoreProperties.load(new FileInputStream(keystorePropertiesFile))
}
// --- End auto-injected ---
`;

if (!content.includes("keystorePropertiesFile")) {
  content = keystoreLoader + "\n" + content;
}

// ---- 2. Add signingConfigs block inside android { } ----
const signingConfigBlock = `
    signingConfigs {
        release {
            keyAlias keystoreProperties['keyAlias']
            keyPassword keystoreProperties['keyPassword']
            storeFile keystoreProperties['storeFile'] ? file(keystoreProperties['storeFile']) : null
            storePassword keystoreProperties['storePassword']
        }
    }`;

if (!content.includes("signingConfigs")) {
  // Insert right after "android {"
  content = content.replace(
    /(android\s*\{)/,
    `$1\n${signingConfigBlock}\n`
  );
}

// ---- 3. Add signingConfig to release buildType ----
if (!content.includes("signingConfig signingConfigs.release")) {
  // Match the release block inside buildTypes and add signingConfig
  content = content.replace(
    /(buildTypes\s*\{[^}]*release\s*\{)/,
    `$1\n            signingConfig signingConfigs.release`
  );
}

// ---- 4. Set versionCode and versionName ----
content = content.replace(
  /versionCode\s+\d+/,
  `versionCode ${versionCode}`
);
content = content.replace(
  /versionName\s+"[^"]*"/,
  `versionName "${versionName}"`
);

// ---- Write patched file ----
fs.writeFileSync(gradleFile, content, "utf8");
console.log(`       build.gradle patched (v${versionName}, code ${versionCode}).`);
