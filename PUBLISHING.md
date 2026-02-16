# 📱 Gehaltsperspektive — Play Store Veröffentlichung

Schritt-für-Schritt-Anleitung zur Veröffentlichung der PWA als Android-App im Google Play Store mit **Bubblewrap** (Trusted Web Activity).

## Was ist Bubblewrap / TWA?

[Bubblewrap](https://github.com/GoogleChromeLabs/bubblewrap) erzeugt eine Android-App, die eine **Trusted Web Activity (TWA)** startet. Die TWA öffnet die gehostete PWA in Chrome — ohne sichtbare Browser-UI. Die App fühlt sich damit wie eine native App an.

Dieser Ansatz ist ideal, weil:

- **Kein Android Studio nötig** — nur JDK und die Bubblewrap CLI
- **Winzige APK** (~1-2 MB) — die App lädt den Inhalt von der gehosteten URL
- **Sofortige Updates** — Code-Änderungen sind live, ohne neuen Play Store Release
- **Service Worker** sorgt für Offline-Support
- Chrome auf dem Gerät wird genutzt (aktuellste Engine, kein veralteter WebView)

---

## Inhaltsverzeichnis

1. [Voraussetzungen](#1-voraussetzungen)
2. [PWA deployen](#2-pwa-deployen)
3. [Bubblewrap einrichten & bauen](#3-bubblewrap-einrichten--bauen)
4. [Digital Asset Links](#4-digital-asset-links)
5. [App-Icon](#5-app-icon)
6. [Release-Keystore](#6-release-keystore)
7. [Google Play Developer Account](#7-google-play-developer-account)
8. [App in der Play Console anlegen](#8-app-in-der-play-console-anlegen)
9. [Store Listing ausfüllen](#9-store-listing-ausfüllen)
10. [Pflichtangaben in der Play Console](#10-pflichtangaben-in-der-play-console)
11. [Release hochladen & testen](#11-release-hochladen--testen)
12. [Veröffentlichung](#12-veröffentlichung)
13. [Updates veröffentlichen](#13-updates-veröffentlichen)
14. [Kosten](#kosten)
15. [Häufige Probleme](#-häufige-probleme)
16. [Checkliste vor dem Release](#-checkliste-vor-dem-release)

---

## 1. Voraussetzungen

| Was | Warum | Prüfbefehl |
|-----|-------|------------|
| **Node.js 18+** | Bubblewrap CLI | `node --version` |
| **JDK 17** | APK/AAB signieren | `java --version` |
| **Bubblewrap CLI** | TWA generieren & bauen | `bubblewrap --version` |
| **Google Play Developer Account** | App veröffentlichen | [play.google.com/console](https://play.google.com/console) (einmalig 25 USD) |

### JDK installieren

Falls noch nicht vorhanden, installiere Adoptium/Temurin JDK 17:

1. Download: [adoptium.net](https://adoptium.net/) — wähle **JDK 17 LTS**
2. Im Installer: Aktiviere **"Add to PATH"** und **"Set JAVA_HOME"**
3. Terminal neu öffnen und prüfen:

```powershell
java --version     # Java 17+ erwartet
keytool -help      # Sollte die Hilfeseite zeigen
```

### Bubblewrap CLI installieren

```bash
npm i -g @bubblewrap/cli
```

Beim ersten Aufruf fragt Bubblewrap, ob es das Android SDK herunterladen soll — bestätige mit **Yes**. Das SDK wird unter `~/.aspect/aspect-build/aspect` (o.ä.) abgelegt (~500 MB).

---

## 2. PWA deployen

Die App muss unter **https://salary-perspective.engelportal.de** erreichbar sein, bevor Bubblewrap die TWA generieren kann.

```bash
# Web-App bauen (erzeugt dist/ mit Service Worker & Manifest)
npm run build
```

Deploye den `dist/`-Ordner auf deinen Webserver / Hoster (z.B. Vercel, Netlify, eigener Server).

### Prüfen, ob die PWA korrekt ist

Öffne https://salary-perspective.engelportal.de in Chrome und prüfe in den DevTools:

1. **Application → Manifest** — Manifest wird korrekt geladen
2. **Application → Service Workers** — Service Worker ist aktiv
3. **Lighthouse → PWA** — PWA-Score sollte grün sein

---

## 3. Bubblewrap einrichten & bauen

### 3.1 Projekt initialisieren

Erstelle einen separaten Ordner für den Android-Build (nicht im Web-Projekt):

```bash
mkdir gehaltsperspektive-android
cd gehaltsperspektive-android

bubblewrap init --manifest="https://salary-perspective.engelportal.de/manifest.webmanifest"
```

Bubblewrap liest das Manifest und fragt interaktiv nach:
- **Package ID**: `com.vibeftw.salaryperspective` (bereits in `twa-manifest.json` definiert)
- **App name**: `Gehaltsperspektive`
- **Launcher name**: `Gehaltsperspektive`
- **Theme color, icons, etc.** — werden aus dem Manifest übernommen

> **Tipp:** Alternativ kannst du die `twa-manifest.json` aus dem Projektordner kopieren und `bubblewrap init` damit initialisieren.

### 3.2 AAB bauen

```bash
bubblewrap build
```

Die Ausgabe:
- `app-release-bundle.aab` — für den Play Store
- `app-release-signed.apk` — zum direkten Testen auf einem Gerät

---

## 4. Digital Asset Links

Damit Chrome die App als vertrauenswürdig erkennt (und die Browser-Adressleiste ausblendet), brauchst du eine **Digital Asset Links**-Datei auf deinem Webserver.

### 4.1 SHA-256 Fingerprint ermitteln

```bash
keytool -list -v -keystore ./gehaltsperspektive-release.keystore -alias gehaltsperspektive
```

Kopiere den **SHA-256 Fingerprint** (z.B. `AB:CD:EF:12:34:...`).

### 4.2 assetlinks.json erstellen

Erstelle die Datei unter `public/.well-known/assetlinks.json` im Web-Projekt:

```json
[
  {
    "relation": ["delegate_permission/common.handle_all_urls"],
    "target": {
      "namespace": "android_app",
      "package_name": "com.vibeftw.salaryperspective",
      "sha256_cert_fingerprints": [
        "DEIN_SHA256_FINGERPRINT_HIER"
      ]
    }
  }
]
```

### 4.3 Deployen & prüfen

Deploye erneut und prüfe:

```
https://salary-perspective.engelportal.de/.well-known/assetlinks.json
```

Die Datei muss mit `Content-Type: application/json` ausgeliefert werden.

> **Ohne Asset Links** zeigt die App eine Chrome-Adressleiste an — die App funktioniert trotzdem, sieht aber weniger nativ aus.

---

## 5. App-Icon

Du brauchst ein Icon in mindestens zwei Größen:

| Größe | Zweck |
|-------|-------|
| 192x192 | Standard-Icon |
| 512x512 | Play Store, Splash Screen |

Lege die Icons unter `public/icons/` ab:
- `public/icons/icon-192x192.png`
- `public/icons/icon-512x512.png`

> Das 512x512-Icon wird auch als **maskable icon** genutzt. Stelle sicher, dass der wichtige Inhalt in der "Safe Zone" (innere 80%) liegt.

---

## 6. Release-Keystore

### 6.1 Keystore generieren

Bubblewrap erstellt beim ersten `bubblewrap build` automatisch einen Keystore. Du kannst auch manuell einen erstellen:

```bash
keytool -genkey -v \
  -keystore gehaltsperspektive-release.keystore \
  -alias gehaltsperspektive \
  -keyalg RSA -keysize 2048 \
  -validity 10000
```

### 6.2 Keystore sicher aufbewahren

> **WICHTIG:** Ohne den Keystore kannst du keine Updates im Play Store veröffentlichen. Speichere eine Kopie an einem sicheren Ort (Passwort-Manager, verschlüsselter USB-Stick).

Der Keystore und Passwörter dürfen **niemals** committet werden. Die `.gitignore` enthält bereits:

```
*.keystore
*.jks
```

---

## 7. Google Play Developer Account

1. Gehe zu [play.google.com/console](https://play.google.com/console)
2. Registriere dich (einmalig **25 USD**)
3. Verifiziere deine Identität (kann einige Tage dauern)

---

## 8. App in der Play Console anlegen

1. Klicke **"App erstellen"**
2. Fülle aus:
   - **App-Name:** Gehaltsperspektive
   - **Standardsprache:** Deutsch
   - **App oder Spiel:** App
   - **Kostenlos oder kostenpflichtig:** Kostenlos
3. Akzeptiere die Richtlinien
4. Klicke **"App erstellen"**

---

## 9. Store Listing ausfüllen

### Titel
```
Gehaltsperspektive — Was kostet mich das wirklich?
```

### Kurzbeschreibung (max. 80 Zeichen)
```
Sieh Preise als Prozent deines Gehalts. Dein persönlicher Preis-Check.
```

### Vollständige Beschreibung
```
Was kostet ein Döner wirklich? Und ein iPhone?

Gehaltsperspektive zeigt dir alltägliche Preise aus einer neuen Perspektive:
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
- **Feature-Graphic:** 1024x500 PNG
- **Screenshots:** Mindestens 2 Screenshots (am besten 4-8)

### Kategorie
- **Kategorie:** Finanzen
- **Tags:** Gehalt, Preisvergleich, Budget, Finanzen, Prozent

---

## 10. Pflichtangaben in der Play Console

### 10.1 Inhaltsbewertung (IARC)

1. Gehe zu **Richtlinien → App-Inhalte → Inhaltsbewertung**
2. Starte den IARC-Fragebogen
3. Die App enthält keine Gewalt, sexuellen Inhalte, In-App-Käufe oder Nutzerdaten
4. Ergebnis: Voraussichtlich **PEGI 3 / USK 0**

### 10.2 Datenschutzerklärung

Da die App **keine Daten erhebt**, ist die Datenschutzerklärung einfach. Erstelle eine öffentlich erreichbare Seite mit:

```
Datenschutzerklärung — Gehaltsperspektive

Diese App erhebt, speichert oder überträgt keine personenbezogenen Daten.

Alle eingegebenen Daten (Gehalt, benutzerdefinierte Artikel) werden
ausschließlich lokal auf Ihrem Gerät im Browser-Speicher (localStorage)
gespeichert. Es erfolgt keine Übertragung an Server oder Dritte.

Die App benötigt keine Internetverbindung nach der Installation und
enthält keine Tracking- oder Analyse-Tools.

Kontakt: [deine E-Mail-Adresse]
```

### 10.3 Datensicherheit (Data Safety)

| Frage | Antwort |
|---|---|
| Erhebt oder teilt die App Nutzerdaten? | **Nein** |
| Verschlüsselt die App Daten bei der Übertragung? | Nicht zutreffend |
| Können Nutzer die Löschung ihrer Daten beantragen? | Nicht zutreffend |

### 10.4 Werbeerklärung

Die App enthält **keine Werbung**.

### 10.5 Zielgruppe & Inhalte

- Die App richtet sich **nicht primär an Kinder**
- Zielgruppe: 18+ (Gehaltsthema)

---

## 11. Release hochladen & testen

1. **Interner Test** (bis zu 100 Tester per E-Mail)
   - Gehe zu **Testen → Interner Test**
   - Lade die AAB-Datei hoch (`app-release-bundle.aab`)
   - Füge Tester hinzu
   - Starte den Release

2. Teste auf einem echten Gerät:
   - [ ] App startet ohne Fehler
   - [ ] Keine Chrome-Adressleiste sichtbar (Digital Asset Links korrekt)
   - [ ] Gehaltseingabe funktioniert
   - [ ] Kategorien-Filter funktioniert
   - [ ] Offline-Modus funktioniert (Service Worker)

---

## 12. Veröffentlichung

1. Alle Pflichtfelder ausgefüllt (siehe Checkliste unten)
2. Gehe zu **Produktion → Neuen Release erstellen**
3. Lade die AAB hoch
4. Release-Notizen hinzufügen
5. **"Rollout für Produktion starten"**

### Review-Dauer
- Erster Release: **1-7 Tage**
- Updates: Meist **1-3 Tage**

---

## 13. Updates veröffentlichen

### Web-Updates (kein neuer Play Store Release nötig!)

Der große Vorteil von TWA: **Web-Änderungen sind sofort live**, sobald du die Website aktualisierst. Der Service Worker sorgt für Updates im Hintergrund.

```bash
npm run build
# dist/ neu deployen → fertig!
```

### Android-Shell-Update (neuer AAB nötig)

Nur bei Änderungen am TWA-Wrapper selbst (z.B. neues Icon, neuer Package Name, neue Bubblewrap-Version):

```bash
cd gehaltsperspektive-android
bubblewrap build
# app-release-bundle.aab in Play Console hochladen
```

Erhöhe die `appVersionCode` in `twa-manifest.json` vor jedem neuen AAB-Upload.

---

## Kosten

### Einmalige Kosten

| Posten | Kosten |
|---|---|
| Google Play Developer-Registrierung | **25 USD** |

### Laufende Kosten

| Posten | Kosten |
|---|---|
| Web-Hosting (salary-perspective.engelportal.de) | Je nach Hoster |
| Domain | Teil von engelportal.de |

---

## ❓ Häufige Probleme

### Chrome-Adressleiste wird angezeigt

- **Digital Asset Links** nicht korrekt eingerichtet
- Prüfe: `https://salary-perspective.engelportal.de/.well-known/assetlinks.json`
- SHA-256 Fingerprint muss zum Keystore passen
- Es kann bis zu 24h dauern, bis Chrome die Asset Links cached

### App zeigt leere Seite

- Service Worker hat einen veralteten Cache → Hard Refresh auf der Website
- Prüfe in Chrome DevTools, ob die Website unter HTTPS korrekt lädt

### Bubblewrap findet kein JDK

- Stelle sicher, dass `JAVA_HOME` gesetzt ist: `echo $env:JAVA_HOME`
- JDK 11-17 wird unterstützt

### Keystore verloren

- Ohne Keystore keine Updates möglich
- Neue App mit neuer Package ID anlegen nötig
- **Tipp:** Google Play App Signing nutzen (Play Console verwaltet den Upload-Key)

---

## 📋 Checkliste vor dem Release

- [ ] PWA läuft unter https://salary-perspective.engelportal.de
- [ ] Lighthouse PWA-Score ist grün
- [ ] Icons vorhanden (192x192, 512x512)
- [ ] Digital Asset Links eingerichtet und erreichbar
- [ ] `bubblewrap build` erfolgreich
- [ ] AAB auf echtem Gerät getestet (kein Browser-Bar)
- [ ] Keystore sicher gespeichert
- [ ] Play Developer Account registriert und verifiziert
- [ ] Store Listing komplett (Titel, Beschreibung, Screenshots, Icon)
- [ ] Inhaltsbewertung (IARC) ausgefüllt
- [ ] Datenschutzerklärung gehostet und verlinkt
- [ ] Datensicherheits-Formular ausgefüllt
- [ ] Interner Test bestanden
- [ ] Release-Notizen geschrieben
