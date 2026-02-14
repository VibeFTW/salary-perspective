# 📱 Salary Perspective — Play Store Veröffentlichung

Schritt-für-Schritt-Anleitung zur Veröffentlichung der App im Google Play Store.

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
9. [Inhaltsbewertung (IARC)](#9-inhaltsbewertung-iarc)
10. [Datenschutzerklärung](#10-datenschutzerklärung)
11. [Release hochladen & testen](#11-release-hochladen--testen)
12. [Veröffentlichung](#12-veröffentlichung)
13. [Updates veröffentlichen](#13-updates-veröffentlichen)

---

## 1. Voraussetzungen

Bevor du starten kannst, brauchst du:

- [ ] **Node.js** (v18+) und **npm** installiert
- [ ] **Android Studio** installiert ([Download](https://developer.android.com/studio))
- [ ] **JDK 17+** installiert (kommt mit Android Studio)
- [ ] **Google Play Developer Account** ([Registrieren](https://play.google.com/console) — einmalig 25 USD)
- [ ] Die App läuft lokal fehlerfrei (`npm run dev`)

---

## 2. Capacitor einrichten

Falls noch nicht geschehen:

```bash
# Capacitor initialisieren
npx cap init salary-perspective com.salaryperspective.app --web-dir dist

# Android-Plattform hinzufügen
npx cap add android
```

Die Datei `capacitor.config.ts` sollte so aussehen:

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

> **Wichtig:** Die `appId` (z.B. `com.salaryperspective.app`) kann nach der ersten Veröffentlichung **nicht mehr geändert** werden. Wähle sie sorgfältig.

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

Der Keystore wird zum Signieren der App benötigt. **Bewahre ihn sicher auf** — ohne ihn kannst du keine Updates veröffentlichen!

```bash
keytool -genkey -v -keystore salary-perspective-release.keystore -alias salary-perspective -keyalg RSA -keysize 2048 -validity 10000
```

Du wirst nach einem Passwort gefragt. **Merke dir das Passwort!**

> ⚠️ **NIEMALS** den Keystore in Git committen! Füge ihn zur `.gitignore` hinzu:
> ```
> *.keystore
> *.jks
> ```

Erstelle eine Datei `android/key.properties` (ebenfalls NICHT committen):

```properties
storePassword=DEIN_PASSWORT
keyPassword=DEIN_PASSWORT
keyAlias=salary-perspective
storeFile=../../salary-perspective-release.keystore
```

Füge in `android/app/build.gradle` die Signing-Config hinzu:

```gradle
// Vor dem android { Block:
def keystorePropertiesFile = rootProject.file("key.properties")
def keystoreProperties = new Properties()
keystoreProperties.load(new FileInputStream(keystorePropertiesFile))

android {
    // ...

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
            // ...
        }
    }
}
```

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

## 9. Inhaltsbewertung (IARC)

1. Gehe zu **Richtlinien → App-Inhalte → Inhaltsbewertung**
2. Starte den IARC-Fragebogen
3. Die App enthält:
   - Keine Gewalt ✓
   - Keine sexuellen Inhalte ✓
   - Keine In-App-Käufe ✓
   - Keine Nutzerdaten ✓
   - Keinen User-Generated Content ✓
4. Ergebnis: Voraussichtlich **PEGI 3 / USK 0** (für alle Altersgruppen)

---

## 10. Datenschutzerklärung

Da die App **keine Daten erhebt**, ist die Datenschutzerklärung einfach. Du brauchst trotzdem eine URL dafür.

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

---

## 11. Release hochladen & testen

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

## 12. Veröffentlichung

1. Stelle sicher, dass alle Pflichtfelder ausgefüllt sind:
   - [ ] Store Listing (Titel, Beschreibung, Screenshots, Icon)
   - [ ] Inhaltsbewertung
   - [ ] Datenschutzerklärung
   - [ ] Preisgestaltung (Kostenlos)
   - [ ] Zielgruppe & Inhalte
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

## 13. Updates veröffentlichen

Für jedes Update:

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

4. Füge Release-Notizen hinzu und starte den Rollout

---

## ❓ Häufige Probleme

### "App wurde abgelehnt"
- Prüfe die E-Mail von Google genau — dort steht der Grund
- Häufig: fehlende Datenschutzerklärung, falsches Altersrating, oder irreführende Screenshots

### "Keystore verloren"
- Ohne Keystore kannst du **keine Updates** veröffentlichen
- Du müsstest eine neue App mit neuer `appId` anlegen
- **Backup-Tipp:** Speichere den Keystore + Passwort an einem sicheren Ort (z.B. Passwort-Manager)

### "AAB zu groß"
- Normalerweise kein Problem bei dieser App (< 5 MB)
- Falls doch: `npm run build` erzeugt bereits optimierten Code

---

## 📋 Checkliste vor dem Release

- [ ] App läuft fehlerfrei (`npm run dev` + `npm run build`)
- [ ] Keystore erstellt und sicher gespeichert
- [ ] AAB-Datei generiert
- [ ] Play Developer Account registriert und verifiziert
- [ ] Store Listing komplett (Titel, Beschreibung, Screenshots, Icon, Feature-Graphic)
- [ ] Inhaltsbewertung ausgefüllt
- [ ] Datenschutzerklärung verlinkt
- [ ] Interner Test bestanden
- [ ] Release-Notizen geschrieben
