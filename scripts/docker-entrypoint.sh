#!/bin/bash
set -e

echo ""
echo "============================================"
echo "  Salary Perspective — Android Build"
echo "============================================"
echo ""

# ---- Configuration ----
APP_ID="${APP_ID:-com.salaryperspective.app}"
APP_NAME="${APP_NAME:-Salary Perspective}"
KEYSTORE_PASSWORD="${KEYSTORE_PASSWORD:-android}"
KEYSTORE_ALIAS="${KEYSTORE_ALIAS:-salary-perspective}"
VERSION_CODE="${VERSION_CODE:-1}"
VERSION_NAME="${VERSION_NAME:-1.0.0}"

# ---- Copy source to writable working directory ----
# /src is mounted read-only from the host; we work in /build
echo "       Copying source to build directory..."
rm -rf /build
mkdir -p /build
cp -a /src/. /build/
cd /build

# ---- Step 1: Install npm dependencies ----
echo "[1/8] Installing npm dependencies..."
npm ci --silent 2>&1 | tail -1 || npm install --silent

# ---- Step 2: Install Capacitor (if not in package.json) ----
if ! node -e "require('@capacitor/cli')" 2>/dev/null; then
    echo "[2/8] Installing Capacitor..."
    npm install --save @capacitor/core @capacitor/cli @capacitor/android --silent
else
    echo "[2/8] Capacitor already installed."
fi

# ---- Step 3: Build web app ----
echo "[3/8] Building web app (npm run build)..."
npm run build

# ---- Step 4: Initialize Capacitor ----
if [ ! -f capacitor.config.ts ] && [ ! -f capacitor.config.json ]; then
    echo "[4/8] Initializing Capacitor..."
    npx cap init "$APP_NAME" "$APP_ID" --web-dir dist
else
    echo "[4/8] Capacitor already initialized."
fi

# ---- Step 5: Add Android platform ----
if [ ! -d android ]; then
    echo "[5/8] Adding Android platform..."
    npx cap add android
else
    echo "[5/8] Android platform already exists."
fi

# ---- Step 6: Sync web assets to Android ----
echo "[6/8] Syncing web build to Android..."
npx cap sync android

# ---- Step 7: Handle keystore & signing ----
echo "[7/8] Configuring release signing..."

KEYSTORE_FILE="/build/salary-perspective-release.keystore"

# Check if keystore was mounted from host
if [ -f /keystore/salary-perspective-release.keystore ]; then
    echo "       Using provided keystore from /keystore mount."
    cp /keystore/salary-perspective-release.keystore "$KEYSTORE_FILE"
elif [ ! -f "$KEYSTORE_FILE" ]; then
    echo "       No keystore found — generating a new one..."
    keytool -genkey -v \
        -keystore "$KEYSTORE_FILE" \
        -alias "$KEYSTORE_ALIAS" \
        -keyalg RSA \
        -keysize 2048 \
        -validity 10000 \
        -storepass "$KEYSTORE_PASSWORD" \
        -keypass "$KEYSTORE_PASSWORD" \
        -dname "CN=$APP_NAME, OU=Development, O=SalaryPerspective, L=Berlin, ST=Berlin, C=DE"

    # Save keystore to output so the user can back it up
    mkdir -p /output
    cp "$KEYSTORE_FILE" /output/salary-perspective-release.keystore
    echo ""
    echo "  !! IMPORTANT: A new keystore was generated."
    echo "  !! It has been saved to output/salary-perspective-release.keystore"
    echo "  !! Move it to the keystore/ folder for future builds."
    echo "  !! WITHOUT THIS FILE YOU CANNOT PUBLISH UPDATES!"
    echo ""
else
    echo "       Using existing keystore in project root."
fi

# Create key.properties for Gradle
cat > android/key.properties <<EOF
storePassword=$KEYSTORE_PASSWORD
keyPassword=$KEYSTORE_PASSWORD
keyAlias=$KEYSTORE_ALIAS
storeFile=$KEYSTORE_FILE
EOF

# Patch build.gradle to include signing config
echo "       Patching build.gradle for release signing..."
node /patch-build-gradle.js \
    --gradle-file android/app/build.gradle \
    --version-code "$VERSION_CODE" \
    --version-name "$VERSION_NAME"

# ---- Step 8: Build release AAB ----
echo "[8/8] Building release AAB (this may take a few minutes)..."
cd android
chmod +x gradlew
./gradlew bundleRelease --no-daemon -q
cd ..

# ---- Copy output ----
mkdir -p /output
AAB_PATH="android/app/build/outputs/bundle/release/app-release.aab"

if [ -f "$AAB_PATH" ]; then
    cp "$AAB_PATH" /output/app-release.aab
    echo ""
    echo "============================================"
    echo "  BUILD SUCCESSFUL!"
    echo "============================================"
    echo ""
    echo "  AAB file:  output/app-release.aab"
    echo "  Size:      $(du -h /output/app-release.aab | cut -f1)"
    echo ""
    echo "  Upload this file to Google Play Console."
    echo "============================================"
    echo ""
else
    echo ""
    echo "  BUILD FAILED — AAB file not found."
    echo "  Check the Gradle output above for errors."
    echo ""
    exit 1
fi
