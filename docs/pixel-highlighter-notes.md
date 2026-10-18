# Arbeitsstand zum Artikel

Der Artikel ist ein Entwurf und nur mit `npm run dev` unter
`/blog/syntax-highlighting-with-just-two-elements/` sichtbar. Production-Build,
Startseite, RSS und Sitemap schließen ihn weiter aus.

## Extraktion

Aus dem Ursprungsrepo übernommenes Prinzip: Tokenfarben → RGBA-Raster → PNG →
CSS background-clip:text. Das Ursprungsrepo wurde nicht verändert.

- `src/lib/pixel-highlighter/raster.ts`: Shiki für JavaScript/TypeScript,
  GitHub Dark/Light Default und das begrenzte ASCII-Raster.
- `browser.ts`: Canvas als PNG-Encoder, nicht als sichtbare Textebene.
- `server.ts`: fast-png beim Build / auf dem Server.
- `src/components/pixel-highlighter/`: Playground, räumliches Ebenenmodell,
  Pipeline-Inspektion, gemessener DOM-Vergleich, Grenzfälle, Update-Experiment
  und statischer Block.
- `src/lib/pixel-highlighter/article.ts`: gemeinsam genutzte Editor-Daten,
  Bild-Decoding, Revisionsschutz und die interaktiven Experimente.
- `src/pages/experiments/[demo].ts`: isolierte HTML-Ausgabe ohne Scripts,
  einschließlich ohne Astro-Dev-Scripts; wie der Draft nur im Dev-Modus sichtbar.
- Renderer und Raster werden als echte Quelldateien im Artikel angezeigt.

Bewusst entfallen: Paket-/Workspace-Struktur, Singleton-Canvas, will-change und
contain:strict. Shiki ersetzt seit 18.10.2026 den ursprünglichen Mini-Lexer.
Keine unbelegten Performance-Zusagen. Die gestalterischen Entscheidungen stehen
in [pixel-highlighter-design.md](./pixel-highlighter-design.md).

## Gemeinsam weiterbearbeiten

- Eigene Motivation / konkrete Integrationserfahrung des Autors ergänzen.
- Weitere vom Autor recherchierte Vor-/Nachteile einarbeiten.
- ASCII-Beschränkung: Tabs expandieren? Unicode-Spaltenmodell? Fallback?
- Benchmarks mit gleicher Tokenisierung und getrennten Phasen entwickeln.
- Browsermatrix einschließlich Safari/Firefox, IME, Zoom, Druck, Forced Colors,
  Auswahl, Bildblockierung, Screenreader und Scrollen durchführen.
- Mit echten Themes Kontraste prüfen; noch kein Accessibility-Audit.
- Erst bei umfangreicheren Experimenten ein separates Beispielrepo anlegen.

Das Dokument ist eine Arbeitsliste, keine bereits durchgeführte Validierung.

## Gesammelte Quellen

Die [Materialsammlung vom 18.10.2026](./syntax-highlighting-research.md) bündelt
Implementierungen, Argumente und Hindernisse aus dem Projects-Ordner,
einschließlich historischer Varianten seit 2023 und alternativer Git-Branches.

## Prüfung am 28.09.2026

- `npm run build`: erfolgreich, Astro-Check ohne Fehler/Warnungen. Der Bundler
  meldet eine Warnung zu `use astro:head-inject` aus MDX; lokale CSS-/Script-
  Einbindung geprüft, Produktionsdarstellung des noch ausgeschlossenen Drafts
  ist damit noch nicht geprüft.
- Im eingebauten Chromium-Browser: Farbraster und Text visuell geprüft;
  Texteingabe aktualisiert Farben; Unicode und mehr als 512 Spalten führen zum
  einfarbigen Fallback; leere Eingabe bleibt funktionsfähig.
- Textfeld horizontal und vertikal gescrollt, Hintergrund folgt dem Text.
- Rohes HTTP-HTML enthält beim statischen Block bereits Text und PNG-Data-URL,
  ohne Token-Spans. Kein vollständiger Test mit deaktiviertem JavaScript.
- Production-Ausgaben für Startseite, Feed und Sitemap enthalten den Draft nicht.
- Noch kein Benchmark und keine Prüfung in Firefox/Safari oder mit Screenreader.

## Umsetzung und Prüfung am 18.10.2026

- Artikel neu aufgebaut: benutzbarer Highlighter, räumliches Erklärmodell,
  tatsächliche Pipeline-Daten, DOM-Vergleich, scriptfreies Beispiel,
  verzögerte Bildupdates, Rastergrenzen sowie Einsatzbereich/Evidenz.
- Figuren bis 860 px breit, bestehende Bloggestaltung und englische Artikelsprache
  beibehalten. Die Ebenen sind ein Erklärmodell, keine Compositing-Behauptung.
  Bei reduzierter Bewegung bleiben flach getrennte Ebenen ohne Übergangsanimation.
- Echte Shiki-Tokens für beide DOM-Vergleichsseiten. Gezählt werden die erzeugten
  pre-/code-/span-Elemente; keine geschätzten Performancewerte.
- Im eingebauten Browser geprüft: eigene Eingabe, GitHub-Light-Wechsel,
  TypeScript, Unicode-Fallback, leere Eingabe, natives Undo, Pipeline-Tabs/PNG
  sowie Elementzählung bei mehreren Codekopien. Normales und umgebrochenes Raster
  anhand der tatsächlichen CSS-Eigenschaften geprüft. Kein horizontaler
  Seitenüberlauf bei 497 px Viewportbreite.
- In Firefox Developer Edition: initiale Syntaxfarben, Desktoplayout,
  aufgesprengte Ebenen und responsive Darstellung bei 390 px Breite angesehen.
  Das ist eine Funktions-/Layout-Stichprobe, keine vollständige Browsermatrix.
- Das Update-Experiment zeigt bei 1500 ms hinzugefügter Latenz unterschiedliche
  Text-/Bildrevisionen und einfarbigen Text während des Wartens. Die Latenz ist
  ausdrücklich künstlich und kein Benchmark.
- Raster-Prüfungen mit Node: Tokens ergeben wieder den Originaltext, Puffermaße,
  Leertext und abschließender Newline, JS/TS, Grenzwerte 512 Spalten/100 Zeilen,
  Ablehnung von Tabs/Unicode und übergroßen Eingaben.
- Beispielkontraste für Kommentar, String, Zahl und sonstige Tokens: mindestens
  6,15:1 im dunklen und 4,55:1 im hellen Theme. Kein vollständiger Theme-/A11y-Audit.
- Isolierte HTML-Ausgabe per HTTP geprüft: null Script-Tags, originaler Text und
  PNG-Data-URL vorhanden.
- `npm run build`: erfolgreich; Astro-Check ohne Fehler/Warnungen. Der Bundler
  meldet weiterhin die bekannte MDX-Head-Inject-Warnung und jetzt einen ca. 534-KiB-
  Shiki-/Browser-Chunk (vor Kompression). Der Tokenizer wird separat dynamisch
  importiert und nicht für statisches Highlighting benötigt.
- Produktionsausgabe für Startseite, RSS und Sitemap enthält weder Draft noch
  isolierte Experimentseite. Die veröffentlichte Darstellung des Drafts ist
  damit weiterhin nicht durch den normalen Produktionsbuild geprüft.
- Design-Lint ausgeführt. Verbleibende Heuristiktreffer gehören zum Experiment:
  Clipping/Fallback-Gradienten, Pipeline-Pfeile, fehlende Messwerte als Gedanken-
  strich, Unicode-Testdaten und Textarea-Scroll-Synchronisierung. Der Scroll-
  Listener hängt am Textfeld, nicht am Fenster.
- Offen: faire Performance-/Transfermessungen, Safari, vollständige Firefox-
  Matrix, echte IME-/Screenreader-Prüfung, Zoom, Druck/Forced Colors und eine
  praktische Prüfung des Reduced-Motion-Pfads.
