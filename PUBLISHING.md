# 📱 Salary Perspective — Play Store Veröffentlichung

Schritt-für-Schritt-Anleitung zur Veröffentlichung der App im Google Play Store.

## Was ist Capacitor?

[Capacitor](https://capacitorjs.com/) verpackt die bestehende Web-App (Vite + React) in eine native Android-Hülle. Beim Build wird das fertige `dist/`-Verzeichnis in eine echte Android-App eingebettet, die über den Play Store installiert werden kann.

Dieser Ansatz ist ideal, weil:

- Die App **keine Server-Komponente** braucht — alles läuft lokal im Browser-Speicher
- **Kein Code-Umbau nötig** — die bestehende Web-App wird 1:1 übernommen
- Die App funktioniert **komplett offline** nach der Installation
- Updates erfordern einen neuen AAB-Upload im Play Store (im Gegensatz zu einer TWA, die eine gehostete Website lädt)

---

## Inhaltsverzeichnis

1. [Voraussetzungen](#1-voraussetzungen)
2. [Capacitor einrichten](#2-capacitor-einrichten)
3. [App-Icon & Splash Screen](#3-app-icon--splash-screen)
4. [Release-Keystore erstellen](#4-release-keystore-erstellen)
5. [Release-Build erstellen (AAB)](#5-release-build-erstellen-aab)
6. [Google Play Developer Account](#6-google-play-developer-account)
7. [App in der Play Console anlegen](#7-app-in-der-play-console-anlegen)
8. [Store Listing ausfüllen](#8-store-listing-ausfüllen)
9. [Pflichtangaben in der Play Console](#9-pflichtangaben-in-der-play-console) (IARC, Datenschutz, Datensicherheit, …)
10. [Release hochladen & testen](#10-release-hochladen--testen)
11. [Veröffentlichung](#11-veröffentlichung)
12. [Updates veröffentlichen](#12-updates-veröffentlichen)
13. [Docker-Build](#docker-build-alles-im-container) (alles im Container)
14. [Kosten](#kosten)
15. [Häufige Probleme](#-häufige-probleme)
16. [Checkliste vor dem Release](#-checkliste-vor-dem-release)

---

## 1. Voraussetzungen

### Option A: Docker-Build (empfohlen — nichts auf Windows installieren)

Du brauchst nur:

- [ ] **Docker** — eine der folgenden Varianten:
  - **Docker Desktop** ([Download](https://www.docker.com/products/docker-desktop/)) — inkl. GUI und `docker compose`
  - **Docker CLI via WSL2** — leichtgewichtig, nur Kommandozeile (siehe [Anleitung](https://docs.docker.com/engine/install/ubuntu/) in deiner WSL-Distro)
- [ ] **Google Play Developer Account** ([Registrieren](https://play.google.com/console) — einmalig 25 USD)

> Mit Docker brauchst du **kein** Node.js, Android Studio oder JDK auf deinem Rechner.
> Alles läuft im Container. Siehe [Docker-Build](#docker-build-alles-im-container) weiter unten.

### Option B: Lokale Installation (klassisch)

Folge den Schritten der Reihe nach. Jeder Schritt enthält einen **Prüfbefehl**, mit dem du sicherstellst, dass alles korrekt installiert ist.

#### B.1 Node.js (v18+) und npm

Node.js wird benötigt, um die Web-App zu bauen und Capacitor zu verwenden. npm (der Paketmanager) wird automatisch mitinstalliert.

1. Lade Node.js herunter: [nodejs.org/en/download](https://nodejs.org/en/download/) — wähle die **LTS**-Version
2. Führe den Installer aus (alle Standardeinstellungen sind OK)
3. **Schließe dein Terminal und öffne ein neues** (damit die PATH-Änderungen wirken)
4. Prüfe die Installation:

```powershell
node --version   # Erwartete Ausgabe: v18.x.x oder höher
npm --version    # Erwartete Ausgabe: 9.x.x oder höher
```

> Falls die Befehle nicht erkannt werden: Starte den PC neu und versuche es erneut.

#### B.2 Android Studio

Android Studio wird benötigt, um das Android-Projekt zu öffnen und die signierte AAB-Datei zu erstellen. Es bringt außerdem ein **JDK** (Java Development Kit) mit, das für den Keystore-Schritt später gebraucht wird.

1. Lade Android Studio herunter: [developer.android.com/studio](https://developer.android.com/studio)
2. Führe den Installer aus. Beim **Setup-Wizard** (erster Start):
   - Wähle **Standard**-Installation
   - Akzeptiere alle SDK-Lizenzen
   - Warte, bis alle Komponenten heruntergeladen sind (kann 5–15 Minuten dauern)
3. Nach der Installation: Öffne Android Studio einmal und lass den initialen Setup durchlaufen

#### B.3 JDK verfügbar machen (für `keytool`)

Android Studio installiert ein JDK, aber fügt es **nicht** automatisch zum System-PATH hinzu. Das bedeutet, dass Befehle wie `keytool` im Terminal noch nicht funktionieren.

**Prüfe zuerst**, ob `keytool` bereits funktioniert:

```powershell
keytool -help
```

Wenn du eine **Hilfeseite** siehst → alles gut, weiter mit B.4.

Wenn du **"keytool wird nicht erkannt"** (oder ähnlich) siehst → füge das JDK zum PATH hinzu:

**Variante 1 — Android Studio JDK verwenden (kein Extra-Download):**

Das JDK von Android Studio liegt typischerweise hier:
```
C:\Program Files\Android\Android Studio\jbr\bin
```

Füge diesen Pfad zur PATH-Umgebungsvariable hinzu:
1. Drücke `Win + R`, tippe `sysdm.cpl` und drücke Enter
2. Reiter **Erweitert** → **Umgebungsvariablen**
3. Unter **Benutzervariablen** (oben): Wähle `Path` → **Bearbeiten** → **Neu**
4. Füge den Pfad ein: `C:\Program Files\Android\Android Studio\jbr\bin`
5. Klicke überall **OK**
6. **Schließe dein Terminal und öffne ein neues**
7. Prüfe erneut:

```powershell
keytool -help   # Sollte jetzt die Hilfeseite anzeigen
java --version  # Sollte Java 17+ anzeigen
```

**Variante 2 — Eigenständiges JDK installieren:**

Falls du den Android-Studio-Pfad nicht findest, kannst du ein JDK separat installieren:
1. Lade Adoptium/Temurin JDK 17 herunter: [adoptium.net](https://adoptium.net/) — wähle **JDK 17 LTS**
2. Im Installer: Aktiviere **"Add to PATH"** und **"Set JAVA_HOME"**
3. Terminal neu öffnen und prüfen:

```powershell
keytool -help
java --version
```

#### B.4 Google Play Developer Account

- [ ] Registriere dich unter [play.google.com/console](https://play.google.com/console) (einmalig **25 USD**)
- [ ] Die Identitätsverifizierung kann einige Tage dauern — starte diesen Schritt frühzeitig

#### B.5 Projekt prüfen

Stelle sicher, dass die App lokal fehlerfrei läuft:

```powershell
npm install      # Abhängigkeiten installieren (falls noch nicht geschehen)
npm run dev      # Entwicklungsserver starten — App im Browser prüfen
```

> Wenn `npm run dev` funktioniert und die App im Browser läuft, bist du bereit für Schritt 2.

---

## 2. Capacitor einrichten

> **Hinweis:** Wenn du den **Docker-Build** nutzt ([siehe unten](#docker-build-alles-im-container)), kannst du diesen Abschnitt überspringen — der Container erledigt alle Schritte automatisch.

### 2.1 Capacitor-Pakete installieren

Zuerst müssen die Capacitor-Pakete als npm-Abhängigkeiten installiert werden. Ohne diesen Schritt ist der `cap`-Befehl nicht verfügbar und `npx cap` schlägt fehl.

```bash
npm install @capacitor/core @capacitor/cli @capacitor/android
```

Was passiert hier?
- **`@capacitor/core`** — die Laufzeit-Bibliothek, die in der App mitläuft
- **`@capacitor/cli`** — das Kommandozeilen-Tool (`cap`), mit dem du Capacitor steuerst
- **`@capacitor/android`** — erzeugt das Android-Projekt (den `android/`-Ordner)

Nach der Installation erscheinen diese drei Pakete in deiner `package.json` unter `dependencies`.

### 2.2 Die App-ID verstehen

Bevor du Capacitor initialisierst, musst du eine **App-ID** (auch "Application ID" oder "Package Name") wählen. Diese ID ist die weltweit eindeutige Kennung deiner App im Google Play Store.

| Eigenschaft | Details |
|---|---|
| **Format** | Umgekehrte Domain-Notation, z.B. `com.salaryperspective.app` |
| **Konvention** | `com.<firmenname>.<appname>` — wenn du keine Domain besitzt, denke dir eine aus |
| **Einschränkungen** | Nur Kleinbuchstaben, Zahlen und Punkte. Mindestens zwei Segmente (z.B. `com.example`) |
| **Änderbar?** | **Nein** — nach der ersten Veröffentlichung im Play Store kann die App-ID **nie** geändert werden |
| **Wo taucht sie auf?** | In der `capacitor.config.ts`, im Android-Projekt, und im Google Play Store als eindeutige Kennung |

In dieser Anleitung verwenden wir **`com.salaryperspective.app`**. Du kannst eine andere ID wählen (z.B. `com.deinname.salaryperspective`), musst dann aber in allen folgenden Schritten deine eigene ID verwenden.

> **Play Console:** Wenn du die App später im Google Play Store anlegst ([Schritt 7](#7-app-in-der-play-console-anlegen)), wird die App-ID automatisch übernommen, sobald du die AAB-Datei hochlädst. Du musst sie dort **nicht manuell eingeben** — sie ist in der AAB eingebettet. Play Console und App-ID müssen übereinstimmen; du legst die ID also jetzt hier fest und der Play Store übernimmt sie.

### 2.3 Capacitor initialisieren

Jetzt wird Capacitor für dein Projekt eingerichtet. Dieser Befehl erstellt die Konfigurationsdatei `capacitor.config.ts` im Projektordner:

```bash
npx cap init "Salary Perspective" com.salaryperspective.app --web-dir dist
```

| Parameter | Bedeutung |
|---|---|
| `"Salary Perspective"` | Der **Anzeigename** der App (erscheint unter dem App-Icon auf dem Handy). Anführungszeichen nötig wegen dem Leerzeichen. |
| `com.salaryperspective.app` | Die **App-ID** (siehe oben). |
| `--web-dir dist` | Sagt Capacitor, dass die fertige Web-App im `dist/`-Ordner liegt (dort, wohin `npm run build` die Dateien schreibt). |

Nach dem Befehl erscheint eine neue Datei **`capacitor.config.ts`** im Projektstamm. Sie sollte so aussehen:

```typescript
import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.salaryperspective.app',
  appName: 'Salary Perspective',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
```

> Falls der `server`-Block fehlt, füge ihn manuell hinzu. `androidScheme: 'https'` sorgt dafür, dass die App HTTPS verwendet, was für manche Browser-APIs (z.B. localStorage) wichtig ist.

### 2.4 Android-Plattform hinzufügen

Dieser Befehl erstellt den kompletten `android/`-Ordner mit einem fertigen Android-Studio-Projekt:

```bash
npx cap add android
```

Das Ergebnis ist ein neuer Ordner `android/` im Projekt, der ein vollständiges Android-Projekt enthält. Diesen Ordner kannst du später mit Android Studio öffnen.

### 2.5 Erster Sync

Zuletzt muss die Web-App einmal gebaut und in das Android-Projekt kopiert werden:

```bash
# Web-App bauen (erzeugt den dist/-Ordner)
npm run build

# Web-Build in das Android-Projekt kopieren
npx cap sync android
```

`cap sync` kopiert den Inhalt von `dist/` in das Android-Projekt und aktualisiert die nativen Abhängigkeiten. Diesen Befehl musst du **nach jeder Code-Änderung** erneut ausführen, bevor du die App testest oder baust.

---

## 3. App-Icon & Splash Screen

Du brauchst ein App-Icon in verschiedenen Größen. Am einfachsten:

1. Erstelle ein **1024x1024 PNG** als Master-Icon
2. Nutze [Android Asset Studio](https://romannurik.github.io/AndroidAssetStudio/icons-launcher.html) um alle Größen zu generieren
3. Ersetze die Dateien in `android/app/src/main/res/mipmap-*`

Für den Splash Screen:
- Erstelle ein einfaches Bild (z.B. Logo auf weißem Hintergrund)
- Lege es in `android/app/src/main/res/drawable/splash.png`

---

## 4. Release-Keystore erstellen

> **Hinweis:** Wenn du den **Docker-Build** nutzt, kannst du diesen Abschnitt überspringen — der Container erstellt den Keystore automatisch.

### Was ist ein Keystore?

Ein Keystore ist eine verschlüsselte Datei, die deinen **digitalen Signaturschlüssel** enthält. Jede App im Play Store muss signiert sein — das beweist, dass Updates wirklich von dir kommen. Ohne den Keystore kannst du **keine Updates** für deine App veröffentlichen.

### 4.1 Keystore generieren

Der Befehl `keytool` stammt aus dem **JDK** (Java Development Kit), das du in [Schritt B.3](#b3-jdk-verfügbar-machen-für-keytool) eingerichtet hast.

**Prüfe zuerst**, ob `keytool` verfügbar ist:

```powershell
keytool -help
```

Falls der Befehl nicht erkannt wird, gehe zurück zu [Schritt B.3](#b3-jdk-verfügbar-machen-für-keytool) und stelle sicher, dass das JDK im PATH ist.

Wenn `keytool` funktioniert, führe folgenden Befehl **im Projektordner** aus:

```powershell
keytool -genkey -v -keystore salary-perspective-release.keystore -alias salary-perspective -keyalg RSA -keysize 2048 -validity 10000
```

| Parameter | Bedeutung |
|---|---|
| `-keystore salary-perspective-release.keystore` | Name der Keystore-Datei, die erstellt wird |
| `-alias salary-perspective` | Ein Name für den Schlüssel innerhalb des Keystores |
| `-keyalg RSA -keysize 2048` | Verschlüsselungsalgorithmus und Schlüssellänge |
| `-validity 10000` | Gültigkeit in Tagen (~27 Jahre) |

Der Befehl fragt dich interaktiv nach:
1. **Keystore-Passwort** — wähle ein sicheres Passwort und **schreibe es auf** (z.B. in einem Passwort-Manager)
2. **Vor- und Nachname, Organisation, Ort, Land** — du kannst hier einfach Enter drücken oder frei ausfüllen. Diese Angaben sind **nicht** öffentlich sichtbar.
3. **Bestätigung** — tippe `ja` oder `yes`

Nach Abschluss liegt eine neue Datei `salary-perspective-release.keystore` im Projektordner.

### 4.2 Keystore vor Git schützen

Der Keystore enthält deinen privaten Schlüssel und darf **niemals** in Git landen.

Prüfe, ob deine `.gitignore` bereits diese Einträge enthält — falls nicht, füge sie hinzu:

```
*.keystore
*.jks
```

### 4.3 Signing-Konfiguration anlegen

Damit Android Studio den Keystore beim Bauen verwenden kann, braucht es zwei Dinge:

**Schritt 1:** Erstelle die Datei `android/key.properties` mit folgendem Inhalt (ersetze `DEIN_PASSWORT` durch dein gewähltes Keystore-Passwort):

```properties
storePassword=DEIN_PASSWORT
keyPassword=DEIN_PASSWORT
keyAlias=salary-perspective
storeFile=../../salary-perspective-release.keystore
```

> Diese Datei ebenfalls **NICHT** committen — sie enthält dein Passwort im Klartext!

**Schritt 2:** Öffne die Datei `android/app/build.gradle` und füge die Signing-Config hinzu. Suche den `android {`-Block und ergänze die markierten Abschnitte:

```gradle
// Diese drei Zeilen VOR den android { Block einfügen:
def keystorePropertiesFile = rootProject.file("key.properties")
def keystoreProperties = new Properties()
keystoreProperties.load(new FileInputStream(keystorePropertiesFile))

android {
    // ... bestehender Inhalt ...

    // Diesen Block innerhalb von android { } einfügen:
    signingConfigs {
        release {
            keyAlias keystoreProperties['keyAlias']
            keyPassword keystoreProperties['keyPassword']
            storeFile file(keystoreProperties['storeFile'])
            storePassword keystoreProperties['storePassword']
        }
    }

    buildTypes {
        release {
            signingConfig signingConfigs.release
            minifyEnabled true
            // ... bestehender Inhalt ...
        }
    }
}
```

### 4.4 Keystore sicher aufbewahren

> **Wichtig:** Bewahre eine Kopie des Keystores und des Passworts an einem sicheren Ort auf (Passwort-Manager, verschlüsselter USB-Stick, etc.). Wenn du den Keystore verlierst, kannst du keine Updates mehr für die App veröffentlichen und müsstest eine komplett neue App anlegen.

---

## 5. Release-Build erstellen (AAB)

Google Play akzeptiert **AAB** (Android App Bundle), keine APKs.

```bash
# 1. Web-App bauen
npm run build

# 2. Build nach Android kopieren
npx cap sync android

# 3. Android Studio öffnen
npx cap open android
```

In Android Studio:

1. **Build → Generate Signed Bundle / APK...**
2. Wähle **Android App Bundle**
3. Wähle deinen Keystore und gib das Passwort ein
4. Wähle **release** als Build-Variante
5. Klicke **Create**

Die AAB-Datei liegt dann unter:
```
android/app/build/outputs/bundle/release/app-release.aab
```

### Auf einem Gerät testen

Bevor du die AAB im Play Store hochlädst, solltest du die App auf einem echten Android-Gerät testen. Dafür brauchst du eine **APK** (nicht die AAB):

**Variante 1 — Debug-APK über Android Studio:**
1. In Android Studio: **Build → Build Bundle(s) / APK(s) → Build APK(s)**
2. Die APK liegt unter `android/app/build/outputs/apk/debug/app-debug.apk`
3. Übertrage sie auf dein Gerät (USB, Cloud, E-Mail) und installiere sie

**Variante 2 — Interner Test im Play Store:**
1. Lade die AAB als internen Test hoch (siehe [Release hochladen & testen](#11-release-hochladen--testen))
2. Installiere die App über den Opt-in-Link auf deinem Gerät

Prüfe nach der Installation:
- [ ] App startet ohne Fehler
- [ ] Gehaltseingabe funktioniert
- [ ] Artikelliste wird korrekt angezeigt mit Prozentbalken
- [ ] Kategorien-Filter funktioniert
- [ ] Eigene Artikel hinzufügen/bearbeiten funktioniert
- [ ] App-Icon und Splash Screen sehen korrekt aus

---

## 6. Google Play Developer Account

1. Gehe zu [play.google.com/console](https://play.google.com/console)
2. Registriere dich (einmalig **25 USD**)
3. Verifiziere deine Identität (kann einige Tage dauern)

---

## 7. App in der Play Console anlegen

1. Klicke **"App erstellen"**
2. Fülle aus:
   - **App-Name:** Salary Perspective
   - **Standardsprache:** Deutsch
   - **App oder Spiel:** App
   - **Kostenlos oder kostenpflichtig:** Kostenlos
3. Akzeptiere die Richtlinien
4. Klicke **"App erstellen"**

---

## 8. Store Listing ausfüllen

### Titel
```
Salary Perspective — Was kostet mich das wirklich?
```

### Kurzbeschreibung (max. 80 Zeichen)
```
Sieh Preise als Prozent deines Gehalts. Dein persönlicher Preis-Check.
```

### Vollständige Beschreibung
```
Was kostet ein Döner wirklich? Und ein iPhone?

Salary Perspective zeigt dir alltägliche Preise aus einer neuen Perspektive:
als Prozent deines Netto-Gehalts.

🔹 Gib dein Monats- oder Jahresgehalt ein
🔹 Sieh 50+ Alltagsgegenstände mit farbigen Prozentbalken
🔹 Filtere nach Kategorien: Essen, Wohnen, Technik, Freizeit
🔹 Füge eigene Artikel hinzu oder passe Preise an
🔹 Alle Daten bleiben lokal auf deinem Gerät

Ob Snickers (0,05%) oder Monatsmiete (37,5%) — plötzlich fühlen sich Preise anders an.

Perfekt für Berufseinsteiger, Studenten, oder alle, die ihre Kaufkraft besser verstehen wollen.

✅ Komplett kostenlos
✅ Keine Werbung
✅ Kein Account nötig
✅ Keine Datenerhebung
```

### Grafiken

Du brauchst:
- **App-Icon:** 512x512 PNG
- **Feature-Graphic:** 1024x500 PNG (das Hero-Bild aus der README kann angepasst werden)
- **Screenshots:** Mindestens 2 Screenshots (am besten 4-8)
  - Empfohlene Größe: 1080x1920 (Phone) oder 1080x2340
  - Zeige: Hauptseite mit Gehalt, Artikelliste mit Prozenten, Kategorien, Verwaltungsseite

> **Tipp:** Nutze ein Tool wie [screenshots.pro](https://screenshots.pro) oder [mockuphone.com](https://mockuphone.com) für hübsche Device-Frames.

### Kategorie
- **Kategorie:** Finanzen
- **Tags:** Gehalt, Preisvergleich, Budget, Finanzen, Prozent

---

## 9. Pflichtangaben in der Play Console

Die Play Console verlangt mehrere Angaben unter **Richtlinien → App-Inhalte**, bevor du veröffentlichen kannst. Ohne diese Angaben bleibt der "Veröffentlichen"-Button gesperrt.

### 9.1 Inhaltsbewertung (IARC)

1. Gehe zu **Richtlinien → App-Inhalte → Inhaltsbewertung**
2. Starte den IARC-Fragebogen
3. Die App enthält:
   - Keine Gewalt ✓
   - Keine sexuellen Inhalte ✓
   - Keine In-App-Käufe ✓
   - Keine Nutzerdaten ✓
   - Keinen User-Generated Content ✓
4. Ergebnis: Voraussichtlich **PEGI 3 / USK 0** (für alle Altersgruppen)

### 9.2 Datenschutzerklärung

Da die App **keine Daten erhebt**, ist die Datenschutzerklärung einfach. Du brauchst trotzdem eine **öffentlich erreichbare URL** dafür.

Erstelle eine einfache Seite (z.B. auf GitHub Pages) mit folgendem Text:

```
Datenschutzerklärung — Salary Perspective

Diese App erhebt, speichert oder überträgt keine personenbezogenen Daten.

Alle eingegebenen Daten (Gehalt, benutzerdefinierte Artikel) werden
ausschließlich lokal auf Ihrem Gerät im Browser-Speicher (localStorage)
gespeichert. Es erfolgt keine Übertragung an Server oder Dritte.

Die App benötigt keine Internetverbindung und enthält keine Tracking-
oder Analyse-Tools.

Kontakt: [deine E-Mail-Adresse]
```

Verlinke diese URL in der Play Console unter **Richtlinien → App-Inhalte → Datenschutzerklärung**.

### 9.3 Datensicherheit (Data Safety)

Unter **Richtlinien → App-Inhalte → Datensicherheit** verlangt Google eine Erklärung, welche Daten die App erhebt. Für Salary Perspective:

| Frage | Antwort |
|---|---|
| Erhebt oder teilt die App Nutzerdaten? | **Nein** |
| Verschlüsselt die App Daten bei der Übertragung? | Nicht zutreffend (keine Netzwerk-Kommunikation) |
| Können Nutzer die Löschung ihrer Daten beantragen? | Nicht zutreffend (keine Daten auf Servern) |

> Da die App rein lokal arbeitet und keine Daten an Server sendet, ist dieser Abschnitt schnell erledigt.

### 9.4 Werbeerklärung

Unter **Richtlinien → App-Inhalte → Werbung**: Angeben, dass die App **keine Werbung enthält**.

### 9.5 Zielgruppe & Inhalte

Unter **Richtlinien → App-Inhalte → Zielgruppe und Inhalte**:

- **Zielgruppe:** Wähle die passenden Altersgruppen (z.B. 18+, da es um Gehälter geht — oder "alle Altersgruppen" wenn bevorzugt)
- Die App richtet sich **nicht primär an Kinder** — das vereinfacht die Anforderungen erheblich

### 9.6 Weitere Erklärungen

Je nach aktuellem Stand der Play Console können weitere Angaben erforderlich sein:

- **Regierungs-Apps:** Nein
- **Finanz-Features:** Nein (die App bietet keine Finanzdienstleistungen, nur eine Visualisierung)
- **Gesundheits-Apps:** Nein

---

## 10. Release hochladen & testen

### Empfohlene Reihenfolge:

1. **Interner Test** (bis zu 100 Tester per E-Mail)
   - Gehe zu **Testen → Interner Test**
   - Lade die AAB-Datei hoch
   - Füge Tester hinzu (deine eigene E-Mail reicht)
   - Starte den Release
   - Tester bekommen einen Opt-in-Link

2. **Geschlossener Test** (optional, bis zu 2.000 Tester)
   - Für größere Beta-Tests

3. **Offener Test** (optional, unbegrenzt)
   - App ist über den Play Store findbar, aber als "Early Access"

4. **Produktion**
   - Finaler Release für alle Nutzer

> **Tipp:** Fange immer mit dem internen Test an. So kannst du die App selbst installieren und Bugs finden, bevor sie öffentlich ist.

---

## 11. Veröffentlichung

1. Stelle sicher, dass alle Pflichtfelder ausgefüllt sind:
   - [ ] Store Listing (Titel, Beschreibung, Screenshots, Icon)
   - [ ] Inhaltsbewertung
   - [ ] Datenschutzerklärung
   - [ ] Datensicherheit
   - [ ] Werbeerklärung
   - [ ] Zielgruppe & Inhalte
   - [ ] Preisgestaltung (Kostenlos)
2. Gehe zu **Produktion → Neuen Release erstellen**
3. Lade die AAB-Datei hoch
4. Füge Release-Notizen hinzu:
   ```
   Erster Release von Salary Perspective!
   - 50+ Alltagsgegenstände mit deutschen Preisen
   - Gehaltseingabe (monatlich/jährlich)
   - Echtzeit-Prozentberechnung
   - 4 Kategorien mit Filter
   - Eigene Artikel hinzufügen & bearbeiten
   ```
5. Klicke **"Überprüfen"** und dann **"Rollout für Produktion starten"**

### Review-Dauer
- Erster Release: **1-7 Tage** (manchmal schneller)
- Updates: Meist **1-3 Tage**

---

## 12. Updates veröffentlichen

Jedes App-Update erfordert einen neuen AAB-Upload im Play Store (anders als bei einer gehosteten Web-App).

### Mit Docker (empfohlen)

Einfach Version erhöhen und neu bauen — der Docker-Container erledigt alles:

```powershell
docker compose run --rm -e VERSION_CODE=2 -e VERSION_NAME="1.1.0" build
# oder ohne Compose:
docker run --rm -v "${PWD}:/src:ro" -v "${PWD}/keystore:/keystore:ro" -v "${PWD}/output:/output" -e VERSION_CODE=2 -e VERSION_NAME="1.1.0" salary-perspective-builder
```

Dann `output/app-release.aab` in der Play Console hochladen.

### Ohne Docker (lokale Installation)

1. Erhöhe die `versionCode` und `versionName` in `android/app/build.gradle`:
   ```gradle
   android {
       defaultConfig {
           versionCode 2        // Muss bei jedem Update steigen
           versionName "1.1.0"  // Für Nutzer sichtbar
       }
   }
   ```

2. Baue neu:
   ```bash
   npm run build
   npx cap sync android
   # In Android Studio: Generate Signed Bundle
   ```

3. Lade die neue AAB in der Play Console hoch (Produktion → Neuer Release)

### Was muss wann aktualisiert werden?

| Änderung | Neuer AAB-Upload nötig? | Neuer Play Store Release? |
|---|---|---|
| Code-Änderungen (Features, Bugfixes) | Ja | Ja |
| App-Icon oder Splash Screen | Ja | Ja |
| Store-Beschreibung, Screenshots | Nein | Nein (direkt in Play Console ändern) |
| Datenschutzerklärung | Nein | Nein (URL bleibt gleich, Inhalt aktualisieren) |

Füge bei jedem Release **Release-Notizen** hinzu (z.B. "Neue Kategorien hinzugefügt, Performance verbessert"). Google zeigt diese den Nutzern im Play Store.

---

## Docker-Build (alles im Container)

Wenn du **nichts lokal installieren** willst (kein Node.js, kein JDK, kein Android Studio), kannst du die AAB-Datei komplett per Docker bauen. Du brauchst nur **Docker** (Desktop oder CLI).

### Erster Build

Wähle die Variante, die zu deinem Setup passt:

<details>
<summary><strong>Mit Docker Compose</strong> (Docker Desktop oder <code>docker compose</code> Plugin)</summary>

```powershell
# 1. Keystore-Ordner & Output-Ordner erstellen
mkdir keystore, output

# 2. Docker-Image bauen & AAB erstellen (erster Durchlauf dauert ~5-10 Min.)
docker compose run --rm build
```

</details>

<details>
<summary><strong>Nur Docker CLI</strong> (ohne Compose)</summary>

```powershell
# 1. Keystore-Ordner & Output-Ordner erstellen
mkdir keystore, output

# 2. Docker-Image bauen
docker build -t salary-perspective-builder .

# 3. AAB erstellen (erster Durchlauf dauert ~5-10 Min.)
docker run --rm `
  -v "${PWD}:/src:ro" `
  -v "${PWD}/keystore:/keystore:ro" `
  -v "${PWD}/output:/output" `
  salary-perspective-builder
```

</details>

Beim ersten Build wird automatisch:
- Ein **Release-Keystore** generiert und nach `output/salary-perspective-release.keystore` kopiert
- Die Web-App gebaut (npm)
- Capacitor + Android-Plattform eingerichtet
- Die signierte **AAB-Datei** nach `output/app-release.aab` kopiert

> **Wichtig:** Sichere den generierten Keystore sofort!
> ```powershell
> # Keystore für zukünftige Builds in den keystore-Ordner verschieben
> Move-Item output/salary-perspective-release.keystore keystore/
> ```

### Folge-Builds / Updates

<details>
<summary><strong>Mit Docker Compose</strong></summary>

```powershell
docker compose run --rm -e VERSION_CODE=2 -e VERSION_NAME="1.1.0" build
```

</details>

<details>
<summary><strong>Nur Docker CLI</strong></summary>

```powershell
docker run --rm `
  -v "${PWD}:/src:ro" `
  -v "${PWD}/keystore:/keystore:ro" `
  -v "${PWD}/output:/output" `
  -e VERSION_CODE=2 `
  -e VERSION_NAME="1.1.0" `
  salary-perspective-builder
```

</details>

Die neue AAB-Datei liegt dann unter `output/app-release.aab`.

### Eigenes Keystore-Passwort setzen

<details>
<summary><strong>Mit Docker Compose</strong></summary>

```powershell
# Beim ersten Build ein sicheres Passwort setzen
docker compose run --rm -e KEYSTORE_PASSWORD="DeinSicheresPasswort123" build

# Bei Folge-Builds dasselbe Passwort verwenden!
docker compose run --rm -e KEYSTORE_PASSWORD="DeinSicheresPasswort123" -e VERSION_CODE=2 build
```

</details>

<details>
<summary><strong>Nur Docker CLI</strong></summary>

```powershell
# Beim ersten Build ein sicheres Passwort setzen
docker run --rm `
  -v "${PWD}:/src:ro" `
  -v "${PWD}/keystore:/keystore:ro" `
  -v "${PWD}/output:/output" `
  -e KEYSTORE_PASSWORD="DeinSicheresPasswort123" `
  salary-perspective-builder

# Bei Folge-Builds dasselbe Passwort verwenden!
docker run --rm `
  -v "${PWD}:/src:ro" `
  -v "${PWD}/keystore:/keystore:ro" `
  -v "${PWD}/output:/output" `
  -e KEYSTORE_PASSWORD="DeinSicheresPasswort123" `
  -e VERSION_CODE=2 `
  salary-perspective-builder
```

</details>

### Alle Konfigurationsoptionen

| Variable           | Standard                     | Beschreibung                           |
|--------------------|------------------------------|----------------------------------------|
| `KEYSTORE_PASSWORD`| `android`                    | Passwort für den Release-Keystore      |
| `KEYSTORE_ALIAS`   | `salary-perspective`         | Alias im Keystore                      |
| `VERSION_CODE`     | `1`                          | Muss bei jedem Update steigen (Integer)|
| `VERSION_NAME`     | `1.0.0`                      | Für Nutzer sichtbare Versionsnummer    |
| `APP_ID`           | `com.salaryperspective.app`  | Android App-ID (nicht ändern!)         |

### Docker Volumes zurücksetzen (Clean Build)

Falls du einen komplett frischen Build brauchst:

<details>
<summary><strong>Mit Docker Compose</strong></summary>

```powershell
docker compose down -v
docker compose run --rm build
```

</details>

<details>
<summary><strong>Nur Docker CLI</strong></summary>

```powershell
# Image neu bauen (--no-cache für komplett frisch)
docker build --no-cache -t salary-perspective-builder .

# Erneut ausführen
docker run --rm `
  -v "${PWD}:/src:ro" `
  -v "${PWD}/keystore:/keystore:ro" `
  -v "${PWD}/output:/output" `
  salary-perspective-builder
```

</details>

### Verzeichnisstruktur nach dem Build

```
salary-perspective/
├── keystore/
│   └── salary-perspective-release.keystore   ← SICHER AUFBEWAHREN!
├── output/
│   └── app-release.aab                       ← Hochladen in Play Console
├── Dockerfile
├── docker-compose.yml                        ← Optional (nur für Compose)
└── ...
```

---

## Kosten

### Einmalige Kosten

| Posten | Kosten | Hinweis |
|---|---|---|
| Google Play Developer-Registrierung | **25 USD** | Einmalig, gilt lebenslang |

### Optionale / laufende Kosten

| Posten | Kosten | Hinweis |
|---|---|---|
| Datenschutzerklärung hosten | **Kostenlos** | Z.B. über GitHub Pages |
| Screenshots / Grafiken | **Kostenlos** | Eigene Screenshots, Canva oder Figma |
| Domain (falls gewünscht) | **~10-15 EUR/Jahr** | Nur nötig, wenn du die Datenschutz-URL auf einer eigenen Domain hosten willst |

### Gesamtkosten Minimum

**25 USD einmalig** — es gibt keine laufenden Kosten, da die App offline funktioniert und kein Server-Hosting benötigt.

---

## ❓ Häufige Probleme

### App wurde von Google abgelehnt
- Lies die Ablehnungs-E-Mail genau — dort steht der **konkrete Richtlinienverstoß**
- Häufigste Gründe:
  - Fehlende oder unzureichende Datenschutzerklärung
  - Datensicherheits-Formular nicht oder falsch ausgefüllt
  - Inhaltsbewertung fehlt
  - Screenshots stimmen nicht mit der App überein
  - App stürzt ab oder zeigt eine leere Seite
- Behebe das Problem und reiche erneut ein. Du bekommst eine neue E-Mail mit dem Ergebnis.

### Keystore verloren
- Ohne Keystore kannst du **keine Updates** für die bestehende App veröffentlichen
- Du müsstest eine komplett neue App mit neuer `appId` anlegen
- **Backup-Tipp:** Speichere den Keystore + Passwort an einem sicheren Ort (z.B. Passwort-Manager, verschlüsselter USB-Stick)
- Bei Docker-Builds: Der Keystore wird beim ersten Build nach `output/` kopiert — verschiebe ihn sofort nach `keystore/`

### AAB zu groß
- Normalerweise kein Problem bei dieser App (< 5 MB)
- Falls doch: `npm run build` erzeugt bereits optimierten Code

### Docker-Build schlägt fehl
- **Image neu bauen** (ohne Cache): `docker build --no-cache -t salary-perspective-builder .`
- **Netzwerkprobleme:** Der erste Build lädt ~1 GB herunter (Android SDK). Stelle sicher, dass die Internetverbindung stabil ist.
- **Speicherplatz:** Das Docker-Image benötigt ca. 3-4 GB. Prüfe mit `docker system df`, ob genug Platz vorhanden ist.
- **Windows-spezifisch:** Stelle sicher, dass Docker Desktop (oder WSL2) läuft und der Docker-Daemon erreichbar ist (`docker info`)

### Veröffentlichen-Button in der Play Console bleibt gesperrt
- Es fehlen noch Pflichtangaben. Prüfe unter **Richtlinien → App-Inhalte**, ob alle Punkte einen grünen Haken haben:
  - Inhaltsbewertung
  - Datenschutzerklärung
  - Datensicherheit
  - Werbeerklärung
  - Zielgruppe & Inhalte

---

## 📋 Checkliste vor dem Release

- [ ] App läuft fehlerfrei (`npm run dev` + `npm run build`)
- [ ] Keystore erstellt und sicher gespeichert
- [ ] AAB-Datei generiert
- [ ] Auf echtem Android-Gerät getestet
- [ ] Play Developer Account registriert und verifiziert
- [ ] Store Listing komplett (Titel, Beschreibung, Screenshots, Icon, Feature-Graphic)
- [ ] Inhaltsbewertung (IARC) ausgefüllt
- [ ] Datenschutzerklärung gehostet und verlinkt
- [ ] Datensicherheits-Formular ausgefüllt
- [ ] Werbeerklärung ausgefüllt
- [ ] Zielgruppe & Inhalte angegeben
- [ ] Interner Test bestanden
- [ ] Release-Notizen geschrieben
