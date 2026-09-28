# Arbeitsstand zum Artikel

Der Artikel ist ein Entwurf und nur mit `npm run dev` unter
`/blog/syntax-highlighting-with-just-two-elements/` sichtbar. Production-Build,
Startseite, RSS und Sitemap schließen ihn weiter aus.

## Extraktion

Aus dem Ursprungsrepo übernommenes Prinzip: Tokenfarben → RGBA-Raster → PNG →
CSS background-clip:text. Das Ursprungsrepo wurde nicht verändert.

- `src/lib/pixel-highlighter/raster.ts`: begrenzter Demo-Tokenizer und Raster.
- `browser.ts`: Canvas als PNG-Encoder, nicht als sichtbare Textebene.
- `server.ts`: fast-png beim Build / auf dem Server.
- `src/components/pixel-highlighter/`: Prinzip-Demo, Textfeld, statischer Block.
- Renderer und Raster werden als echte Quelldateien im Artikel angezeigt.

Bewusst entfallen: Paket-/Workspace-Struktur, Shiki-Konfiguration, Singleton-
Canvas, will-change und contain:strict. Keine unbelegten Performance-Zusagen.
Shiki ist eine sinnvolle nächste Variante, wenn wir die Rendering-Idee erklärt
haben; es ersetzt den Demo-Tokenizer, nicht die übrige Architektur.

## Gemeinsam weiterbearbeiten

- Eigene Motivation / konkrete Integrationserfahrung des Autors ergänzen.
- Weitere vom Autor recherchierte Vor-/Nachteile einarbeiten.
- Produktionsziel wählen: Artikel-Codeblöcke oder kleine Editoren?
- ASCII-Beschränkung: Tabs expandieren? Unicode-Spaltenmodell? Fallback?
- Benchmarks mit gleicher Tokenisierung und getrennten Phasen entwickeln.
- Browsermatrix einschließlich Safari/Firefox, IME, Zoom, Druck, Forced Colors,
  Auswahl, Bildblockierung, Screenreader und Scrollen durchführen.
- Mit echten Themes Kontraste prüfen; noch kein Accessibility-Audit.
- Standalone-SSR-Seite ohne Script für einen unabhängigen No-JS-Test erwägen.
- Erst bei umfangreicheren Experimenten ein separates Beispielrepo anlegen.

Das Dokument ist eine Arbeitsliste, keine bereits durchgeführte Validierung.

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
