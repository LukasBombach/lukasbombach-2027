# Lukas Bombach — Blog

Statischer Blog mit Astro 7.3.5 und Tailwind CSS 4.3.3 nach dem [Figma-Design](https://www.figma.com/design/q26cReqlEWZz2CUCfV4epz/lukasbombach.com-2026?node-id=20-604). Alle direkten Paketversionen sind exakt fixiert; `package-lock.json` fixiert die gesamte Installation. `.npmrc` sorgt auch bei neuen Installationen für exakte Versionen.

## Lokal starten

Node.js ab 22.12.0 verwenden.

```sh
npm ci
npm run dev
```

`npm run build` prüft TypeScript und erstellt die statische Website in `dist/`. `npm run preview` zeigt den Produktionsbuild lokal.

## Beiträge schreiben

Erstelle eine `.md`-Datei unter `src/content/blog/`, zum Beispiel `mein-neuer-beitrag.md`:

```md
---
title: Mein neuer Beitrag
description: Eine kurze Zusammenfassung für die Startseite.
date: 2026-09-27
lang: de
draft: false
---

Hier steht dein Text.

## Zwischenüberschrift

Markdown unterstützt Links, Bilder, Listen und Codeblöcke.
```

Die Datei erscheint automatisch unter `/blog/mein-neuer-beitrag/`, auf der Startseite (neueste zuerst) und im RSS-Feed `/rss.xml`. Titel und Beschreibung sind Pflichtfelder. `lang` ist optional und standardmäßig `en`. Mit `draft: true` bleibt der Beitrag vollständig aus dem Build ausgeschlossen. Beiträge mit einem zukünftigen Datum erscheinen erst bei einem Build nach diesem Datum; die statische Website braucht dafür ein erneutes Deployment.

`mein-erster-beitrag.md` ist eine vorbereitete deutsche Entwurfsvorlage. Der sichtbare Beitrag „Syntax highlighting…“ und dessen Lorem-ipsum-Beschreibung sind Demonstrationsinhalte aus dem Design und müssen vor der Veröffentlichung durch deine Inhalte ersetzt werden. Die zwei älteren Beiträge verlinken auf deine Originalartikel und enthalten passende englische Beschreibungen sowie die Titelbilder und Lesezeiten der Originalseiten.

### Bilder und externe Artikel

Lege Bilder in `src/assets/` ab. Im Frontmatter werden die Pfade relativ zur Markdown-Datei angegeben. Astro prüft sie und erzeugt optimierte WebP-Bilder:

```yaml
gallery:
  - src: ../../assets/mein-bild.png
    alt: Aussagekräftige Bildbeschreibung
```

Optional kannst du statt einer eigenen Artikelseite einen externen Beitrag verlinken:

```yaml
externalUrl: https://example.com/mein-artikel
source: example.com
preview:
  image: ../../assets/mein-bild.png
  alt: Aussagekräftige Bildbeschreibung
  title: Titel für die Vorschaukarte
  readingTime: 5 min read
```

Ohne `externalUrl` öffnen Vorschaukarten und Galerien die lokale Artikelseite. Externe Artikel öffnen sich in einem neuen Tab, inklusive Kennzeichnung für Screenreader.

## Profil und Design

Name, Bio und Kontaktlinks werden in `src/data/profile.ts` gepflegt. Der Mastodon-Eintrag enthält im Design nur „AES“, ohne Instanz oder Profiladresse. Ergänze dort deine vollständige URL; bis dahin wird der Text ohne Link angezeigt. Die übrigen Profil-URLs sind aus den Handles im Design abgeleitet und sollten vor dem Launch geprüft werden.

Die Oberfläche folgt dem englischen Figma-Original; einzelne Beiträge können Deutsch oder Englisch sein. Die Desktop-Inhaltsspalte ist 600 px breit. Bis 540 px steht das Datum über dem Beitrag, während die Kontaktliste zweispaltig bleibt. Bilder passen sich der verfügbaren Breite an. Auf kleinen Bildschirmen gibt es 24 px Seitenabstand und 40 px Außenabstand oben und unten.

Der Dark Mode folgt ausschließlich `@media (prefers-color-scheme: dark)`; es gibt weder einen Schalter noch JavaScript dafür. Farben werden zentral in `src/styles/global.css` gepflegt. Inter wird lokal ausgeliefert, Bilder ebenfalls. Die Produktionsseiten benötigen kein Client-JavaScript.

## Veröffentlichung

Der Build ist unabhängig vom Hosting-Anbieter: Build-Befehl `npm run build`, Ausgabeverzeichnis `dist`. Lade den Inhalt von `dist/` bei einem statischen Webhost hoch oder verbinde das Repository mit deinem Anbieter. Aktuell ist kein Hosting-Konto angebunden und kein Deployment ausgeführt.

Die Zieladresse in `astro.config.mjs` ist `https://lukasbombach.com`. Passe sie bei einer anderen Domain an, damit Canonical-URLs und RSS stimmen. Der Host sollte `404.html` als Fehlerseite verwenden. Neue Beiträge benötigen einen neuen Build und ein Deployment.
