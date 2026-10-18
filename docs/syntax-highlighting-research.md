# Materialsammlung: Syntax highlighting with just two elements

Stand: 18.10.2026. Grundlage für die weitere Arbeit am Blogartikel.

## Ergebnis

Die eigentliche Implementierungs- und Argumentationsarbeit liegt überwiegend in
`/Users/luke/Projects/high-perf-syntax-highlighter`, einschließlich seiner
Git-Historie und alternativer Branches. Das aktuelle Blogprojekt enthält bereits
eine didaktisch vereinfachte Umsetzung, einen ausführlichen Artikelentwurf und
eine Liste offener Prüfungen. Drei weitere Projekte enthalten Ankündigungen des
Artikels, aber keinen ausgearbeiteten Text zum Verfahren.

Das gemeinsame Prinzip: Ein Tokenizer liefert Farben. Ein Bild speichert eine
Farbe pro Textzelle und eine Pixelzeile pro Codezeile. CSS skaliert dieses Bild
auf ein Monospace-Raster und schneidet es mit `background-clip: text` auf die
Glyphen zu. Der Quelltext bleibt Text; das Bild enthält nur Farben.

Für den Artikel trägt deshalb folgende Aussage bereits die Implementierung:
**Syntaxfarben ohne zusätzliche Token-Elemente, mit echter Textdarstellung und
optional nativer Texteingabe.** Ob die gesamte Verarbeitung schneller oder der
übertragene Inhalt kleiner ist, bleibt eine Messfrage.

## 1. Quellen und ihr Stellenwert

Die Links zeigen auf die untersuchten lokalen Dateien. Zeilennummern beziehen
sich auf den Stand der Recherche. Historische Dateien sind über die in Abschnitt
2 genannten Git-Commits wieder auffindbar.

| Fundstelle | Inhalt | Stellenwert für den Artikel |
| --- | --- | --- |
| [Ursprungsprojekt: README](/Users/luke/Projects/high-perf-syntax-highlighter/README.md:1) | Architektur, erwartete Vorteile, Grenzen, Decoding-Problem, Entscheidungen, nächste Schritte | Wichtigste vorhandene Argumentationssammlung; mehrere Aussagen sind stärker formuliert als ihre Belege |
| [Ursprungsprojekt: Tokenizer/Raster](/Users/luke/Projects/high-perf-syntax-highlighter/packages/highlighter-core/src/core.ts:71) | Shiki-Tokens, Farbauswertung, Zeilen und Breiten, CSS-Hintergrundgröße | Praktische Variante mit echter Sprachgrammatik; aktueller Arbeitsstand enthält uncommittierte Änderungen |
| [Ursprungsprojekt: Browser](/Users/luke/Projects/high-perf-syntax-highlighter/packages/highlighter-core/src/browser.ts:24) | Wiederverwendetes Canvas, RGBA-Puffer, PNG-Data-URL | Farben werden gerastert; Text wird nicht ins Canvas gezeichnet |
| [Ursprungsprojekt: Server](/Users/luke/Projects/high-perf-syntax-highlighter/packages/highlighter-core/src/server.ts:26) | PNG-Encoding mit `fast-png`, Base64 | Serverseitiger Weg ist bereits implementiert |
| [Ursprungsprojekt: Editor](/Users/luke/Projects/high-perf-syntax-highlighter/apps/web/src/pages/index.astro:20) | Einzelnes Textarea, Bild vorladen, Hintergrund im nächsten Animation Frame setzen | Ursprünglicher editierbarer Anwendungsfall |
| [Ursprungsprojekt: SSR-Seite](/Users/luke/Projects/high-perf-syntax-highlighter/apps/web/src/pages/ssr.astro:1) | TypeScript-Beispiel, serverseitiges Bild, Darstellung direkt auf einem `pre` | Konkreter statischer Anwendungsfall; benötigt für das Highlighting kein Client-Script |
| [Aktueller Artikelentwurf](/Users/luke/Projects/lukasbombach-2027/src/content/blog/syntax-highlighting-with-just-two-elements.mdx:1) | Erklärung, Browser-/Server-/Editor-Demos, Einschränkungen, Platzhalter für weitere Interaktion | Aktuelle redaktionelle Basis, `draft: true` |
| [Bestehende Arbeitsnotizen](/Users/luke/Projects/lukasbombach-2027/docs/pixel-highlighter-notes.md:1) | Herkunft der Extraktion, bewusste Vereinfachungen, offene Fragen, Prüfprotokoll vom 28.09.2026 | Bestehender Validierungsstand; keine neue Prüfung vom heutigen Tag |
| [Blog: Raster](/Users/luke/Projects/lukasbombach-2027/src/lib/pixel-highlighter/raster.ts:1) | Kleiner Demo-Lexer, ASCII-Beschränkung, Größenlimits | Lehrbeispiel, kein vollständiger JavaScript-Tokenizer |
| [Blog: Browser-Encoder](/Users/luke/Projects/lukasbombach-2027/src/lib/pixel-highlighter/browser.ts:1) / [Server-Encoder](/Users/luke/Projects/lukasbombach-2027/src/lib/pixel-highlighter/server.ts:1) | Gleiches Raster, unterschiedliche PNG-Encoder | Gute Trennung zwischen Prinzip und Laufzeit |
| [Blog: Editor](/Users/luke/Projects/lukasbombach-2027/src/components/pixel-highlighter/Editor.astro:14) | `decode()`, Versionsprüfung, Scheduling, Composition-Events, einfarbiger Zwischenzustand | Weitergehende Absicherung der asynchronen Updates gegenüber der Ursprungsdemo |
| [Blog: CSS](/Users/luke/Projects/lukasbombach-2027/src/components/pixel-highlighter/pixel.css:1) | Gemeinsame Textmetriken, Auswahl, Scrollen, CSS-Support-Abfrage, Fallback-Farbe, Druck/Forced Colors | Zeigt, welche Integrationsarbeit über den CSS-Kerntrick hinaus nötig ist |

### Weitere Spuren in anderen Projekten

- [just-reactive-jsx: Startseite](/Users/luke/Projects/just-reactive-jsx/src/pages/index.tsx:18):
  Titel **„Syntax highlighting with CSS and a background image“** und ein Teaser
  über das viele Markup herkömmlicher Highlighter. Die
  [Artikelseite](/Users/luke/Projects/just-reactive-jsx/src/pages/syntax-highlighting-with-css-and-a-background-image.tsx:1)
  enthält lediglich `hello world`; auch die beiden gefundenen Datei-Commits vom
  21./23.11.2023 enthalten keinen Artikeltext.
- [juno: Portfolio](/Users/luke/Projects/juno/apps/portfolio/src/pages/index.astro:28):
  Link **„Syntax highlighting with just two html elements“**, mit angezeigtem
  Datum Dezember 2025. Im untersuchten Portfolio-Verzeichnis keine passende
  Artikelseite gefunden. Das Anzeigedatum belegt keine Veröffentlichung.
- [lukasbombach-2026: Startseite](/Users/luke/Projects/lukasbombach-2026/src/pages/index.astro:24):
  Link **„Syntax highlighting with just two elements“**, mit angezeigtem Datum
  März 2026. Keine zugehörige ausgearbeitete Artikelseite gefunden.

## 2. Wiedergefundene Entwicklungsgeschichte

Alle folgenden Commits liegen im lokalen Repo
`/Users/luke/Projects/high-perf-syntax-highlighter`. Die Branches wurden gelesen,
ohne den Checkout zu wechseln. Die Varianten bilden mehrere Entwicklungslinien;
sie sind nicht sämtlich Bestandteile des heutigen `main`.

| Datum / Commit | Wiedergefundenes Material | Bedeutung |
| --- | --- | --- |
| 03.09.2023, `91521b3` | Next.js und farbiges Textarea | Das Experiment begann bereits 2023 |
| 15.09.2023, `72310a1`, Datei `src/components/EditorShiki.tsx` | React, Shiki, `bmp-js`, Base64-BMP, ein Farbwert pro Zeichenposition, CSS-Clipping | Das Prinzip funktionierte schon mit BMP; PNG ist die spätere Transportwahl |
| 15.09.2023, `2ce4e56` | Commit „profiling perf“; Wechsel zwischen vorbereiteten Bildern, Tokenisierung zeitweise auskommentiert | Historischer Versuch, Kosten des Bildwechsels von anderen Pipeline-Kosten zu isolieren; keine gespeicherte Vergleichsmessung in den geprüften Quellen |
| 24.09.2023, `acb9d23` | Commit „CONTAIN STRICT = PERFORMANCE“; Prism/Canvas und CSS-Containment | Konkrete damalige Optimierungserfahrung; Commit-Titel liefert keinen quantitativen Beleg |
| 02.10.2023, `229f07d` | Commit „BIG PERF IMPROVEMENTS WITH IMG“; `Image.onload` vor dem CSS-Hintergrundwechsel | Wichtiger praktischer Stolperstein: ein erzeugtes Bild ist nicht automatisch schon zur Darstellung decodiert |
| 03.10.2023, `78c7572` / `origin/x` | `src/worker.ts`, `src/offscreencanvas.ts`, Übergabe per `transferControlToOffscreen()` in `src/main.ts` | Worker/OffscreenCanvas wurde tatsächlich ausprobiert. Teile sind auskommentiert bzw. unvollständig; kein fertiger produktiver Weg |
| 22.02.2026, `f0a47ca` und `47a1210` | `ARCHITECTURE.md`, danach in `README.md` umbenannt | Hier liegt die ausführliche ältere Beschreibung von Vorteilen und Hindernissen; damals mit Prism und manuellem Theme-Mapping |
| 22.02.2026, `3968d65` / `ssr` | `packages/highlighter/`, `apps/demo/` mit CSR/SSR, separate Tokenisierung, Raster und Encoder | Alternative modulare Architektur mit Browser-/Server-Wegen |
| 22./27.02.2026, `9326536`, `5af9e78` / `monorepo-lib` | `packages/high-perf-syntax-highlighter/`, API `tokenizeToLines`, `renderToRgbaBuffer`, `renderToDataUrl`, `attachTextarea`; Astro-Playground | Weiterer Library-Ansatz mit API und Lebenszyklus, nicht nur eine einzelne Demo |
| 22.02.2026, `9326536` | `src/core.test.ts` und `src/dom.browser.test.ts` im vorgenannten Paket | Testdateien für Rastermaße/Fallback/Hintergrundgröße sowie Hintergrundupdate und `detach()` existieren. Das belegt weder damaligen Testerfolg noch Browserkompatibilität oder Performance |
| 27.02.2026, `658eda0` | SSR-Seite in der Entwicklungslinie des heutigen `main` | SSR ist seitdem umgesetzt, obwohl die README es noch als nächsten Schritt aufführt |
| 06.03.2026, `497e878` bis `eb9cb4f` | Heutige Struktur `packages/highlighter-core` / `apps/web`, getrennte Browser-/Server-Imports | Basis des aktuellen Ursprungsprojekts |
| Uncommittierter Stand am 18.10.2026 | Shiki ersetzt im aktuellen Working Tree Prism; JS/TS, Horizon/One Dark Pro, Sprach-/Theme-IDs | Wichtig beim Wiederverwenden: `HEAD` allein enthält nicht denselben Code wie die aktuell gelesenen Dateien |
| 28.09.2026, Blogrepo `6085352`, `fee7598` | Extraktion in dieses Blogprojekt mit vereinfachtem Lexer, drei Demos und Artikeltext | Das Blogbeispiel ist eine bewusste didaktische Ableitung |

Historische Dateien gezielt lesen, ohne einen Branch auszuchecken:

```sh
git -C /Users/luke/Projects/high-perf-syntax-highlighter show f0a47ca:ARCHITECTURE.md
git -C /Users/luke/Projects/high-perf-syntax-highlighter show 72310a1:src/components/EditorShiki.tsx
git -C /Users/luke/Projects/high-perf-syntax-highlighter show 78c7572:src/offscreencanvas.ts
git -C /Users/luke/Projects/high-perf-syntax-highlighter show 5af9e78:packages/high-perf-syntax-highlighter/src/dom.ts
git -C /Users/luke/Projects/high-perf-syntax-highlighter show 9326536:packages/high-perf-syntax-highlighter/src/core.test.ts
git -C /Users/luke/Projects/high-perf-syntax-highlighter show 9326536:packages/high-perf-syntax-highlighter/src/dom.browser.test.ts
```

## 3. Vorteile: Was wir aus den Quellen übernehmen können

| Gedanke | Beleg / Einschränkung | Geeignete Aussage im Artikel |
| --- | --- | --- |
| Konstante Zahl an Textelementen | Statische Blogdemo: `pre > code`; Ursprungs-SSR: ein `pre`; editierbar: ein Textarea. Demos haben zusätzliche Beschriftungen und Container | „Keine zusätzlichen Elemente pro Token.“ „Zwei Elemente“ beschreibt den statischen `pre`/`code`-Block, nicht die gesamte Seite |
| Text bleibt Text | Die HTML-Elemente enthalten den Quelltext; Canvas enthält ausschließlich Farben | Text muss nicht aus einem Screenshot rekonstruiert werden; Auswahl und Kopieren bleiben Aufgaben der Textdarstellung |
| Nativer Editor als Grundlage | Das Eingabeelement ist ein Textarea, kein nachgebauter Editor mit eigener Textdarstellung | Caret, Auswahl, Eingabe und Undo können auf dem nativen Eingabeelement aufbauen. IME und Accessibility brauchen trotzdem Prüfung |
| Keine zweite Textebene | Die Farbe sitzt direkt am Textelement; keine parallele, farbige Textkopie nötig | Es entfällt die Synchronisierung zweier Textdarstellungen |
| Farben im Bild gebündelt | Das Raster enthält die Tokenfarben; Textmetriken und Clipping liegen weiterhin in CSS | Für Tokenfarben werden keine Klassen oder Theme-Farbregeln benötigt. Das Verfahren ist nicht CSS-frei |
| Server-/Build-Rendering | In Ursprungsprojekt und Blog implementiert | Für einen statischen Block kann das Highlighting ohne Client-JavaScript ausgeliefert werden; das ist kein exklusiver Vorteil gegenüber serverseitigen Span-Highlightern |
| Tokenizer austauschbar | Historisch Shiki und Prism; aktueller Blog mit Mini-Lexer; aktueller Ursprungs-Working-Tree wieder mit Shiki | Der Ansatz ersetzt die Darstellung der Tokens. Er braucht weiterhin einen Tokenizer |
| Kompakte Farbinformation denkbar | Ein Pixel je Rasterzelle, viele wiederholte Farben; README nennt „a few KB“ | Konkrete PNG-/HTML-/Transfergrößen erst messen; keine pauschale Größenersparnis behaupten |

Die README-Formulierung „zero DOM nodes“ sollte als **keine zusätzlichen
Token-Elemente** präzisiert werden. Auch ohne Token-Spans entstehen Kosten für
Tokenisierung, Puffer, Encoding, Decoding und Paint.

## 4. Hindernisse und bisherige Antworten

### Raster und Schrift

- **Monospace und identische Metriken:** Zellbreite, Zeilenhöhe, Padding,
  Buchstabenabstand und Hintergrundposition müssen zusammenpassen. Der Blog
  fixiert diese Eigenschaften ausdrücklich und deaktiviert Ligaturen/Kerning.
- **Umbruch:** Ein Bild enthält eine Zeile je logischer Quelltextzeile. Soft Wrap
  erzeugt zusätzliche visuelle Zeilen. Der Blogeditor setzt `wrap="off"`; eine
  vollständige Umbruchlösung wurde in den geprüften Varianten nicht gefunden.
  Das Ursprungs-Textarea setzt kein entsprechendes `wrap="off"`-Attribut.
- **Tabs und Unicode:** Die einfache Zellzählung reicht für Tabs, kombinierende
  Zeichen, Emoji oder breite Glyphen nicht. Im aktuellen Shiki-Core wird
  `token.content.length` gezählt: UTF-16-Länge ist kein allgemeines Maß für
  sichtbare Spalten. Der Blog lehnt alles außer druckbarem ASCII und Newlines für
  die Farbgebung ab und lässt den Text einfarbig lesbar.
- **Lange Zeilen:** Die längste Zeile bestimmt die Breite des gesamten Bildes.
  Der rechteckige Rohpuffer wächst mit maximaler Zeilenbreite × Zeilenzahl,
  einschließlich ungenutzter Zellen. Die Blogdemo begrenzt auf 512 × 100.

### Aktualisierung beim Tippen

- **Decoding und Flackern:** Die README beschreibt weiße Zwischenzustände beim
  direkten Bildwechsel. Die Ursprungsdemo lädt das Bild über `Image.onload`
  vor und setzt den Hintergrund in `requestAnimationFrame`.
- **Alte Farben auf neuem Text:** Während ein neues Bild entsteht, stimmen die
  alten Farben möglicherweise nicht mehr mit dem Text überein. Der aktuelle
  Blogeditor zeigt währenddessen eine einheitliche Textfarbe, wartet auf
  `image.decode()` und verwirft Ergebnisse älterer Revisionen.
- **Scheduling:** Der Blog bündelt ausstehende Updates per Animation Frame und
  wartet während Composition-Eingaben. Auf dem Library-Branch gibt es einen
  `pending`-Schutz sowie wählbares Microtask-/rAF-Scheduling. Die heutige
  Ursprungsdemo ruft dagegen pro Input `queueMicrotask(updateBgImage)` auf.
  Daraus allein folgt kein Debouncing mehrerer Tastaturereignisse.
- **Restkosten bleiben:** Die vorliegenden aktuellen Varianten berechnen das
  gesamte Raster erneut. Worker, inkrementelle Tokenisierung und
  `Uint32Array`-Optimierung sind keine fertig integrierten Eigenschaften dieser
  Varianten. Historische Worker-Versuche sind allerdings vorhanden.

### Umfang, Auslieferung und Darstellung

- **Nur Farben:** Ein Farbbild liefert keine individuellen fetten/kursiven
  Tokens, Token-Links oder DOM-Ziele für Hover/Tooltips. Diese Funktionen würden
  zusätzliche Mechanismen benötigen.
- **Themes:** Andere Farben erfordern ein anderes Bild. Im aktuellen Shiki-Core
  sind zwei Sprachen und zwei Themes fest importiert; freie IDs bedeuten keine
  beliebig nachladbaren Grammatiken oder Themes.
- **Inline vs. externe Bilddatei:** Data-URLs vermeiden einen zusätzlichen
  Bildrequest, vergrößern aber das HTML. Eine separate Datei wäre unabhängig
  cachebar. Die gefundenen Demos verwenden Data-URLs; die Dateivariante ist noch
  keine ausgearbeitete Vergleichsdemo.
- **Fehler-/Druckdarstellung:** Der Blog ergänzt eine einfarbige
  Hintergrundebene, eine Support-Abfrage, explizite Auswahlfarben und Regeln
  für Print/Forced Colors. Das sind vorhandene Maßnahmen, kein vollständiger
  Kompatibilitäts- oder Accessibility-Nachweis.
- **Scrollen, Zoom, Browser:** Der Blog setzt für Textarea-Hintergründe
  `background-attachment: local`. Die vorhandenen Notizen protokollieren
  Chromium-Scrolltests, aber keine Safari-/Firefox-Matrix.
- **Encoder-Unterschied im Ursprungsprojekt:** Der Browser schreibt RGBA; der
  Server schreibt RGB und verwirft dabei Alpha. Vor einer direkten Übernahme
  sollte klar sein, ob transparente Themefarben unterstützt werden müssen.

## 5. Aussagen aus älteren Notizen, die wir einordnen sollten

| Alte Aussage / Eindruck | Stand nach dem Quellenabgleich |
| --- | --- |
| „zero DOM overhead“ | Keine Token-Elemente; andere Renderkosten bleiben |
| „native editing for free“, einschließlich IME/Accessibility | Native Textarea-Funktionen als Grundlage vorhanden; Zusammenspiel mit transparentem Text und Hintergrundfarbe nicht vollständig geprüft |
| „tiny payloads (a few KB)“ | Erwartung aus der README; keine belastbare Größenreihe in den geprüften Quellen gefunden |
| `toDataURL()` gegenüber `toBlob()` ohne messbaren Nachteil | Entscheidung dokumentiert; kein zugehöriger Vergleichsbenchmark gefunden |
| `contain: strict` bringt Performance | Historische Implementierungsänderung und positiver Commit-Titel vorhanden; keine reproduzierbare Messung gefunden. Im Blog bewusst weggelassen |
| `will-change` sorgt für GPU-Compositing | In der Ursprungsdemo vorhanden; kein Nachweis einer konkreten Compositing-/Performance-Wirkung gefunden. Im Blog bewusst weggelassen |
| SSR als „Potential Next Step“ | Überholt: Server-Encoder und statische Demo existieren bereits |
| Worker/OffscreenCanvas als rein zukünftige Idee | Es gibt einen unfertigen Versuch von 2023; im aktuellen Verfahren weiterhin nicht fertig integriert |
| Batching per `queueMicrotask` | Für die heutige Ursprungsdemo zu weit formuliert; beim Library-Branch existiert zusätzlich ein `pending`-Schutz |

## 6. Was der heutige Artikel schon leistet und was das Material ergänzt

Bereits vorhanden: Erklärung des Rasters, sichtbare Farbpixel, Browser-Encoder,
Build-Rendering, editierbare Demo, echte Quelldateien im Artikel sowie eine
ehrliche Auflistung von Grenzen. Die bestehenden Arbeitsnotizen dokumentieren
Build- und Chromium-Prüfungen vom 28.09.2026. Sie nennen ausdrücklich fehlende
Benchmarks, weitere Browser und Screenreader-Tests.

Aus der Recherche lohnt sich vor allem diese Ergänzung:

1. **Konkrete Entwicklungserfahrung:** Das Verfahren entstand über mehrere
   Anläufe seit 2023. Besonders das Vorladen/Decodieren des Bildes liefert einen
   anschaulichen Erfahrungsabschnitt statt einer rein abstrakten Erklärung.
2. **Tokenizer und Darstellung unterscheiden:** Im Ursprungsprojekt existiert
   Shiki bereits als praktische Variante. Der kleine Lexer im Artikel ist eine
   bewusste Vereinfachung, keine technische Voraussetzung des Ansatzes.
3. **Die zwei Anwendungsfälle gewichten:** Statische Codeblöcke eignen sich für
   eine klare Einführung. Der Editor zeigt anschließend den zusätzlichen Reiz
   und die zusätzlichen Schwierigkeiten.
4. **Die stärksten Vorteile konkret halten:** Keine Token-Spans, echtes
   Textelement, keine zweite Textebene, Farbtransport im Bild. Diese Punkte
   brauchen keinen vorweggenommenen Geschwindigkeitsvergleich.
5. **Historische Optimierungserfahrung als Erfahrung erzählen:** Bild-Decoding,
   Containment und Worker-Versuche erklären den Weg. Messbare Performance-
   Aussagen brauchen eine eigene Untersuchung.

Die Platzhalter im Artikel sind noch keine implementierten Funktionen: DOM-
Vergleich, verschiebbare Ebenen, Theme-Wechsel, isolierte No-JS-Seite,
künstliche Decode-Verzögerung und gezieltes Brechen des Rasters. Die vorhandene
Farbraster-Demo und der Editor decken jeweils bereits einen Teil davon ab.

## 7. Vorschlag für die nächste redaktionelle Runde

Möglicher roter Faden:

1. Problem und konkrete Idee: Warum Tokenfarben ein eigenes Element brauchen
   lassen, wenn Text und Farbe getrennt transportiert werden können?
2. Raster zeigen: Ein Bildpixel wird zu einer Monospace-Zelle.
3. Minimalen statischen Block erklären: Text + Farbbild + feste CSS-Metriken.
4. Server-/Build-Ausgabe und Integration zeigen.
5. Mit derselben Idee ein Textarea einfärben.
6. Den tatsächlich aufgetretenen Decoding-Stolperstein und die heutige Lösung
   erklären.
7. Grenzen nachvollziehbar machen; offene Performance-Frage sauber benennen.

Für die persönliche Einleitung fehlen weiterhin die ursprüngliche Motivation
und die subjektive Erfahrung des Autors. Commit-Namen belegen Versuche, aber
keine vollständige Erinnerung daran, welches konkrete Problem damals den
Ausschlag gab.

Wenn Performance Teil der Kernaussage werden soll, ist der nächste Beleg ein
Vergleich mit gleichem Tokenizer, gleicher Eingabe und gleichen Farben:
Tokenisierung, Raster/HTML-Erzeugung, PNG-Encoding, Decode/Paint und Eingabe-
Latenz getrennt betrachten; DOM-Zahl und komprimierte Transfergröße ergänzen.
Ein Vergleich des Blog-Mini-Lexers mit einem vollständigen Shiki-Highlighter
würde die Rendering-Idee nicht isolieren.

## Rechercheumfang und Grenzen

Durchsucht wurden Text-/Quelldateien einschließlich versteckter Projektdateien
unter `/Users/luke/Projects`, mit Begriffen und Dateinamen rund um Syntax-
Highlighting, wenige Elemente, Pixel, Canvas und Text-Clipping. Abhängigkeiten,
Build-Ausgaben, Caches, Lockfiles und ähnliche generierte Bestände wurden für
die inhaltliche Suche ausgeschlossen. Die Git-Historie aller lokal verfügbaren
Refs des Ursprungsprojekts sowie die einschlägige Artikeldatei-Historie in
`just-reactive-jsx` wurden zusätzlich geprüft. Andere Repo-Historien wurden
nicht vollständig durchsucht; entfernte, lokal nicht verfügbare Branches und
Chatverläufe waren nicht Teil dieser Recherche.

Diese Sammlung beruht auf Quellenlektüre, Git-Historie und Codeinspektion.
Es wurden heute keine neuen Laufzeit-, Browser-, Accessibility- oder
Performance-Tests durchgeführt. Bestehende Notizen und historische Kommentare
wurden als Quellen behandelt, nicht als zusätzliche Arbeitsaufträge.
