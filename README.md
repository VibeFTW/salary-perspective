<p align="center">
  <img src="public/hero.png" alt="Salary Perspective Hero" width="100%" />
</p>

<h1 align="center">💰 Salary Perspective</h1>

<p align="center">
  <strong>Was kostet mich das wirklich?</strong><br/>
  Sieh alltägliche Preise als Prozent deines Gehalts.
</p>

<p align="center">
  <img alt="React" src="https://img.shields.io/badge/React-18-61dafb?logo=react&logoColor=white" />
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5.6-3178c6?logo=typescript&logoColor=white" />
  <img alt="Tailwind CSS" src="https://img.shields.io/badge/Tailwind_CSS-3.4-38bdf8?logo=tailwindcss&logoColor=white" />
  <img alt="Vite" src="https://img.shields.io/badge/Vite-6-646cff?logo=vite&logoColor=white" />
  <img alt="PWA" src="https://img.shields.io/badge/PWA-Bubblewrap-6a1b9a?logo=googlechrome&logoColor=white" />
</p>

---

## 📖 Über die App

Jeder kennt den Preis eines Döners, einer Packung Nudeln oder eines iPhones. Aber was kosten diese Dinge **wirklich** — gemessen an dem, was man verdient?

Ein Döner für 7,50 EUR klingt günstig. Aber wenn man 1.500 EUR netto im Monat verdient, ist das 0,5% des Gehalts. Ein iPhone für 1.200 EUR? Das sind satte **80% eines Monatsgehalts**. Wer hingegen 5.000 EUR verdient, für den sind es "nur" 24%. Der gleiche Gegenstand, der gleiche Preis — aber ein völlig anderes Gefühl.

Genau hier setzt **Salary Perspective** an: Sie macht Preise *persönlich*. Man gibt einmal sein Netto-Gehalt ein — wahlweise monatlich oder jährlich — und sieht sofort eine kuratierte Liste von alltäglichen Dingen: Lebensmittel, Miete, Technik, Freizeit. Jedes Ding zeigt seinen Preis und daneben, wie viel Prozent des eigenen Gehalts es ausmacht.

> 🍫 Ein Snickers? **0,05%**
> 🏠 Die Monatsmiete? Vielleicht **37,5%**
> 🎮 Eine PlayStation 5? **20%**
>
> Plötzlich fühlen sich Preise anders an.

### 💡 Das Konzept: Haushaltsspezifische Inflation

Wir alle kennen die offizielle Inflationsrate — aber die spiegelt selten die eigene Realität wider. Die sogenannte *haushaltsspezifische Inflation* beschreibt, wie sich Preisänderungen auf den individuellen Haushalt auswirken. Wer viel für Miete und Lebensmittel ausgibt, spürt Preissteigerungen in diesen Bereichen stärker als jemand, der sein Geld für Technik ausgibt.

Diese App visualisiert genau das: Sie zeigt nicht abstrakte Zahlen, sondern **deine persönliche Perspektive** auf Preise. Was für den einen Kleingeld ist, kann für den anderen ein echter Brocken vom Gehalt sein.

---

## ✨ Features

| | Feature | Beschreibung |
|---|---|---|
| 💰 | **Gehaltseingabe** | Netto-Gehalt eingeben — monatlich oder jährlich umschaltbar |
| 📊 | **Prozent-Perspektive** | Jeder Artikel zeigt seinen Anteil am Gehalt als farbiger Balken |
| 🔄 | **Echtzeit-Berechnung** | Sofortige Aktualisierung ohne Speichern oder Neuladen |
| 📱 | **Mobile-First** | Optimiert für Smartphones, funktioniert auch am Desktop |
| 🏷️ | **Kategorien** | Essen, Wohnen, Technik, Freizeit — filtere nach Interesse |
| ✏️ | **Anpassbar** | Eigene Artikel hinzufügen, Preise bearbeiten, Artikel löschen |
| 🔒 | **Privat** | Alle Daten bleiben lokal auf deinem Gerät — kein Account nötig |
| 📦 | **50+ Artikel** | Vorgeladene Alltagsgegenstände mit aktuellen deutschen Preisen |

---

## 📸 Screenshots

<!-- Screenshots hier einfügen nach dem ersten Build -->
*Screenshots folgen nach dem ersten Release.*

---

## 🎨 Assets

Fertige Assets für den Play Store liegen im `assets/` Ordner:

| Asset | Datei | Größe |
|-------|-------|-------|
| App-Icon | `assets/app-icon-1024.png` | 1024x1024 |
| Splash Screen | `assets/splash-screen.png` | Portrait (9:16) |
| Feature-Graphic | `assets/feature-graphic.png` | 1024x500 |
| Hero-Bild (README) | `public/hero.png` | Wide (3:1) |

---

## 🛠️ Tech Stack

- ⚛️ **React 18** + TypeScript
- ⚡ **Vite** — blitzschneller Dev-Server
- 🎨 **Tailwind CSS** + **shadcn/ui** — schöne, responsive Komponenten
- 🧠 **Zustand** — leichtgewichtiges State Management mit localStorage
- 🧭 **React Router v6** — zwei Seiten: Startseite + Verwaltung
- 📱 **Bubblewrap (TWA)** — PWA als Android-App im Play Store
- 🎯 **Lucide React** — Icon-Bibliothek

---

## 🚀 Lokale Entwicklung

```bash
# Abhängigkeiten installieren
npm install

# Entwicklungsserver starten
npm run dev

# Produktions-Build
npm run build

# Build-Vorschau
npm run preview
```

### PWA / Android-Build (Bubblewrap)

Die App wird als PWA deployed und mit [Bubblewrap](https://github.com/GoogleChromeLabs/bubblewrap) als TWA (Trusted Web Activity) in den Play Store gebracht — kein Android Studio nötig.

```bash
# 1. Web-App bauen (inkl. Service Worker & Manifest)
npm run build

# 2. Auf https://salary-perspective.engelportal.de deployen

# 3. Bubblewrap CLI installieren (einmalig)
npm i -g @bubblewrap/cli

# 4. Android-Projekt generieren & AAB bauen
bubblewrap init --manifest="https://salary-perspective.engelportal.de/manifest.webmanifest"
bubblewrap build
```

Für die vollständige Play Store Anleitung siehe [PUBLISHING.md](PUBLISHING.md).

---

## 📁 Projektstruktur

```
src/
├── components/         # UI-Komponenten
│   ├── ui/            # shadcn/ui Basis-Komponenten
│   ├── SalaryInput    # Gehaltseingabe mit EUR-Formatierung
│   ├── SalaryModeToggle # Monat/Jahr Umschalter
│   ├── CategoryFilter # Kategorie-Tabs
│   ├── ItemCard       # Einzelner Artikel mit Prozentbalken
│   ├── ItemList       # Gefilterte, sortierte Artikelliste
│   ├── ItemForm       # Dialog zum Hinzufügen/Bearbeiten
│   ├── BottomNav      # Navigation unten
│   └── PercentBar     # Farbcodierter Fortschrittsbalken
├── pages/             # Seiten
│   ├── HomePage       # Hauptseite (Gehalt + Filter + Liste)
│   └── ManagePage     # Verwaltungsseite (CRUD)
├── store/             # Zustand Store mit Persist
├── data/              # 50+ Standard-Artikel
├── types/             # TypeScript Types
└── lib/               # Hilfsfunktionen (cn, formatEUR, etc.)
```

---

## 📄 Lizenz

MIT License — frei verwendbar.
