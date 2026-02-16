# 📱 Gehaltsperspektive — Play Store Veröffentlichung

Schritt-für-Schritt-Anleitung zur Veröffentlichung der PWA als Android-App im Google Play Store mit [**PWABuilder**](https://www.pwabuilder.com/).

## Warum PWABuilder?

[PWABuilder](https://www.pwabuilder.com/) ist ein kostenloses Tool von Microsoft, das eine gehostete PWA in ein Play-Store-fertiges Android-Paket (AAB) verpackt. Unter der Haube nutzt es Bubblewrap/TWA — aber du musst dafür **nichts installieren**. Alles passiert über eine Web-Oberfläche.

| Vorteil | Details |
|---------|---------|
| **Kein Android Studio** | Nichts installieren, kein JDK, kein SDK |
| **Kein CLI-Tool** | Kein Bubblewrap, kein Terminal nötig |
| **Web-UI** | Alles im Browser unter pwabuilder.com |
| **Winzige APK** | ~1-2 MB — die App lädt Inhalte von der Website |
| **Sofortige Web-Updates** | Code-Änderungen sind live, ohne neuen Play Store Release |
| **Offline-Support** | Service Worker sorgt für Offline-Fähigkeit |

---

## Übersicht: 5 Schritte zum Play Store

```
1. PWA deployen          → salary-perspective.engelportal.de
2. PWABuilder öffnen     → URL eingeben, Paket generieren
3. Digital Asset Links   → assetlinks.json deployen
4. Play Console          → App anlegen, Store Listing ausfüllen
5. AAB hochladen         → Testen & veröffentlichen
```

---

## Schritt 1: PWA bauen & deployen

Die App muss unter **https://salary-perspective.engelportal.de** öffentlich erreichbar sein.

### 1.1 Produktions-Build erstellen

```bash
npm run build
```

Das erzeugt den `dist/`-Ordner mit:
- Optimiertem HTML/JS/CSS
- Web-Manifest (`manifest.webmanifest`)
- Service Worker (automatisch generiert durch `vite-plugin-pwa`)

### 1.2 Deployen

Lade den Inhalt von `dist/` auf deinen Webserver hoch (z.B. via FTP, rsync, CI/CD).

### 1.3 PWA-Qualität prüfen

Öffne https://salary-perspective.engelportal.de in Chrome und prüfe:

1. **DevTools → Application → Manifest** — Manifest wird geladen, Name und Icons sind korrekt
2. **DevTools → Application → Service Workers** — Service Worker ist aktiv
3. **Lighthouse → PWA** — alle Checks grün

> PWABuilder prüft das ebenfalls und zeigt Warnungen, falls etwas fehlt.

### 1.4 Icons bereitstellen

Stelle sicher, dass diese Dateien existieren:

| Datei | Größe | Zweck |
|-------|-------|-------|
| `public/icons/icon-192x192.png` | 192x192 | Standard-Icon |
| `public/icons/icon-512x512.png` | 512x512 | Play Store, Splash, Maskable |

> **Maskable Icon:** Der wichtige Inhalt sollte in der inneren 80% (Safe Zone) liegen. Teste mit [maskable.app/editor](https://maskable.app/editor).

---

## Schritt 2: Android-Paket mit PWABuilder generieren

### 2.1 PWABuilder öffnen

1. Gehe zu **[pwabuilder.com](https://www.pwabuilder.com/)**
2. Gib die URL ein: `https://salary-perspective.engelportal.de`
3. Klicke **"Start"**

PWABuilder analysiert die Website und prüft:
- Web-Manifest vorhanden & gültig
- Service Worker registriert
- HTTPS aktiv
- Icons in richtiger Größe

### 2.2 Report prüfen

PWABuilder zeigt einen Score für Manifest, Service Worker und Sicherheit. Alles sollte grün sein. Falls Warnungen angezeigt werden — behebe sie, rebuild und deploy erneut.

### 2.3 Android-Paket generieren

1. Klicke **"Package for stores"**
2. Wähle **"Android"**
3. PWABuilder zeigt ein Formular mit vorausgefüllten Werten aus dem Manifest. Prüfe/ändere:

| Feld | Wert |
|------|------|
| **Package ID** | `com.vibeftw.salaryperspective` |
| **App name** | `Gehaltsperspektive` |
| **App version** | `1.0.0` |
| **App version code** | `1` |
| **Host** | `salary-perspective.engelportal.de` |
| **Start URL** | `/` |
| **Theme color** | `#0f172a` |
| **Background color** | `#0f172a` |
| **Status bar color** | `#0f172a` |
| **Nav bar color** | `#0f172a` |
| **Display mode** | `Standalone` |
| **Signing key** | **"New" → Neuen Signing Key erstellen** (oder vorhandenen hochladen) |

4. Klicke **"Generate"**
5. **Lade das ZIP-Paket herunter**

### 2.4 ZIP-Inhalt

Das heruntergeladene ZIP enthält:

| Datei | Zweck |
|-------|-------|
| `app-release-bundle.aab` | **Das ist die Datei für den Play Store** |
| `signing-key-info.txt` | Signing Key-Infos — **SICHER AUFBEWAHREN!** |
| `assetlinks.json` | Digital Asset Links (für Schritt 3) |
| `README.md` | Anleitung von PWABuilder |

> **WICHTIG:** Sichere `signing-key-info.txt` sofort an einem sicheren Ort (Passwort-Manager). Ohne diesen Key kannst du keine Updates veröffentlichen.

---

## Schritt 3: Digital Asset Links einrichten

Damit die App **ohne Chrome-Adressleiste** angezeigt wird (= echtes App-Feeling), muss dein Webserver beweisen, dass die Android-App dir gehört.

### 3.1 assetlinks.json deployen

PWABuilder hat die Datei bereits generiert (im ZIP unter `assetlinks.json`). Kopiere sie in dein Web-Projekt:

```
public/.well-known/assetlinks.json
```

Die Datei sieht ungefähr so aus:

```json
[
  {
    "relation": ["delegate_permission/common.handle_all_urls"],
    "target": {
      "namespace": "android_app",
      "package_name": "com.vibeftw.salaryperspective",
      "sha256_cert_fingerprints": [
        "AA:BB:CC:DD:..."
      ]
    }
  }
]
```

### 3.2 Neu deployen

```bash
npm run build
# dist/ erneut hochladen
```

### 3.3 Prüfen

Öffne im Browser:

```
https://salary-perspective.engelportal.de/.well-known/assetlinks.json
```

Die Datei muss:
- Erreichbar sein (kein 404)
- `Content-Type: application/json` haben
- Den korrekten SHA-256 Fingerprint enthalten

> **Tipp:** Google bietet einen Validator: [digitalassetlinks.googleapis.com](https://digitalassetlinks.googleapis.com/v1/statements:list?source.web.site=https://salary-perspective.engelportal.de&relation=delegate_permission/common.handle_all_urls)

---

## Schritt 4: Google Play Console einrichten

### 4.1 Developer Account

Falls noch nicht vorhanden:

1. Gehe zu [play.google.com/console](https://play.google.com/console)
2. Registriere dich (einmalig **25 USD**)
3. Verifiziere deine Identität (kann einige Tage dauern — frühzeitig starten!)

### 4.2 App anlegen

1. Klicke **"App erstellen"**
2. Fülle aus:
   - **App-Name:** `Gehaltsperspektive`
   - **Standardsprache:** Deutsch
   - **App oder Spiel:** App
   - **Kostenlos oder kostenpflichtig:** Kostenlos
3. Akzeptiere die Richtlinien → **"App erstellen"**

### 4.3 Store Listing ausfüllen

**Titel:**
```
Gehaltsperspektive — Was kostet mich das wirklich?
```

**Kurzbeschreibung** (max. 80 Zeichen):
```
Sieh Preise als Prozent deines Gehalts. Dein persönlicher Preis-Check.
```

**Vollständige Beschreibung:**
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

**Grafiken:**

| Asset | Spezifikation |
|-------|---------------|
| App-Icon | 512x512 PNG (hochauflösend) |
| Feature-Graphic | 1024x500 PNG |
| Screenshots | Mind. 2, empfohlen 4-8 (1080x1920 oder 1080x2340) |

**Kategorie:** Finanzen

### 4.4 Pflichtangaben ausfüllen

Unter **Richtlinien → App-Inhalte** müssen alle Punkte einen grünen Haken haben:

#### Inhaltsbewertung (IARC)

Starte den Fragebogen. Die App enthält keine Gewalt, sexuellen Inhalte, In-App-Käufe oder Nutzerdaten. Ergebnis: **PEGI 3 / USK 0**.

#### Datenschutzerklärung

Erstelle eine öffentlich erreichbare Seite (z.B. unter `salary-perspective.engelportal.de/privacy`) mit:

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

Verlinke die URL in der Play Console.

#### Datensicherheit (Data Safety)

| Frage | Antwort |
|---|---|
| Erhebt oder teilt die App Nutzerdaten? | **Nein** |
| Verschlüsselt die App Daten bei der Übertragung? | Nicht zutreffend |
| Können Nutzer die Löschung ihrer Daten beantragen? | Nicht zutreffend |

#### Weitere Angaben

- **Werbung:** Nein
- **Zielgruppe:** Nicht primär Kinder (18+)
- **Regierungs-App:** Nein
- **Finanz-Features:** Nein

---

## Schritt 5: AAB hochladen & veröffentlichen

### 5.1 Interner Test (empfohlen)

1. Gehe zu **Testen → Interner Test → Neuen Release erstellen**
2. Lade `app-release-bundle.aab` aus dem PWABuilder-ZIP hoch
3. Füge dich selbst als Tester hinzu (E-Mail-Adresse)
4. **Release starten**
5. Installiere die App über den Opt-in-Link auf deinem Gerät

### 5.2 Auf dem Gerät prüfen

- [ ] App startet ohne Fehler
- [ ] **Keine Chrome-Adressleiste** sichtbar (Asset Links korrekt)
- [ ] Gehaltseingabe funktioniert
- [ ] Kategorien-Filter funktioniert
- [ ] Artikeldetails mit Prozentbalken korrekt
- [ ] Eigene Artikel hinzufügen/bearbeiten funktioniert
- [ ] App funktioniert nach Flugmodus-Aktivierung (Offline via Service Worker)

### 5.3 Produktion

1. Gehe zu **Produktion → Neuen Release erstellen**
2. Lade die AAB hoch (dieselbe Datei wie beim internen Test)
3. Release-Notizen:
   ```
   Erster Release von Gehaltsperspektive!
   - 50+ Alltagsgegenstände mit deutschen Preisen
   - Gehaltseingabe (monatlich/jährlich)
   - Echtzeit-Prozentberechnung
   - 4 Kategorien mit Filter
   - Eigene Artikel hinzufügen & bearbeiten
   ```
4. **"Überprüfen"** → **"Rollout für Produktion starten"**

### Review-Dauer

- Erster Release: **1-7 Tage**
- Updates: Meist **1-3 Tage**

---

## Updates veröffentlichen

### Web-Updates (kein neuer Play Store Release nötig!)

Der große Vorteil von TWA: **Web-Änderungen sind sofort live**, sobald du die Website aktualisierst. Kein neues AAB nötig.

```bash
npm run build
# dist/ neu deployen → fertig!
```

Features, Bugfixes, neue Artikel, UI-Änderungen — alles sofort live für alle Nutzer.

### TWA-Shell-Update (neuer AAB nötig)

Nur bei Änderungen an der Android-Hülle selbst (selten):

- Neues App-Icon
- Andere Package ID
- Geänderte Theme-/Statusbar-Farben
- Neue Android-Berechtigungen

In diesem Fall: PWABuilder erneut durchlaufen → neues AAB generieren → in Play Console hochladen (mit erhöhtem Version Code).

---

## Kosten

| Posten | Kosten |
|---|---|
| Google Play Developer-Registrierung | **25 USD** (einmalig) |
| PWABuilder | **Kostenlos** |
| Web-Hosting | Je nach Hoster (Subdomain von engelportal.de) |

**Gesamtkosten Minimum: 25 USD einmalig.**

---

## ❓ Häufige Probleme

### PWABuilder zeigt Warnungen

- **"No service worker found"** → `npm run build` und prüfe, ob der Service Worker im `dist/`-Ordner liegt
- **"Manifest incomplete"** → Prüfe `vite.config.ts` — alle Pflichtfelder (name, icons, display, start_url) müssen gesetzt sein
- **"Icons missing"** → `public/icons/icon-192x192.png` und `icon-512x512.png` müssen existieren

### Chrome-Adressleiste wird in der App angezeigt

- `assetlinks.json` nicht erreichbar unter `/.well-known/assetlinks.json`
- SHA-256 Fingerprint stimmt nicht mit dem Signing Key überein
- Es kann bis zu **24 Stunden** dauern, bis Chrome die Asset Links cached
- Prüfe mit dem [Google Asset Links Validator](https://digitalassetlinks.googleapis.com/v1/statements:list?source.web.site=https://salary-perspective.engelportal.de&relation=delegate_permission/common.handle_all_urls)

### App zeigt leere/weiße Seite

- Website unter HTTPS nicht erreichbar → im Browser testen
- Service Worker cached veraltete Dateien → Cache leeren (DevTools → Application → Clear storage)

### Signing Key verloren

- Ohne den Signing Key keine Updates im Play Store möglich
- **Vorbeugung:** `signing-key-info.txt` aus dem PWABuilder-ZIP sofort sichern
- **Rettung:** Falls du Google Play App Signing aktiviert hast, kannst du einen neuen Upload-Key anfordern

---

## 📋 Checkliste vor dem Release

### PWA & Deployment

- [ ] `npm run build` läuft fehlerfrei
- [ ] PWA erreichbar unter https://salary-perspective.engelportal.de
- [ ] Icons vorhanden (`icon-192x192.png`, `icon-512x512.png`)
- [ ] Lighthouse PWA-Score ist grün
- [ ] `assetlinks.json` erreichbar unter `/.well-known/assetlinks.json`

### PWABuilder

- [ ] PWABuilder zeigt keine Fehler
- [ ] AAB heruntergeladen (`app-release-bundle.aab`)
- [ ] `signing-key-info.txt` sicher gespeichert

### Play Console

- [ ] Developer Account registriert und verifiziert
- [ ] App angelegt (Name: Gehaltsperspektive)
- [ ] Store Listing komplett (Titel, Beschreibung, Screenshots, Icon, Feature-Graphic)
- [ ] Inhaltsbewertung (IARC) ausgefüllt
- [ ] Datenschutzerklärung gehostet und verlinkt
- [ ] Datensicherheits-Formular ausgefüllt
- [ ] Werbeerklärung ausgefüllt
- [ ] Zielgruppe & Inhalte angegeben

### Testen

- [ ] Interner Test gestartet
- [ ] App auf echtem Gerät installiert und getestet
- [ ] Keine Chrome-Adressleiste sichtbar
- [ ] Offline-Modus funktioniert
- [ ] Release-Notizen geschrieben
