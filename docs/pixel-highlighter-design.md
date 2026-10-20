# Interaktiver Syntax-Highlighting-Artikel

Der Einstieg zeigt zunächst das Problem: tatsächlicher Span-DOM, vollständiges
HTML als Klartext und die Elementzähler machen die Größenordnung
sichtbar. Ein Slider erhöht die Code-Menge von 1 bis 100 Zeilen. Erst dann folgen
die Zwei-Elemente-Idee, ein benutzbarer Editor und
das räumliche Erklärmodell, danach Architektur, Nutzen, Grenzen und Evidenz.

Bestehende Bloggestaltung: Inter für Text, System-Monospace für Code und
Messwerte. Fließtext bleibt in der 600-px-Spalte, Abbildungen bis 860 px breit.
Abstände: 8/16/24/32/48 px. Radien: Controls 6 px, Abbildungsrahmen 10 px.
Farben: Page/Ink/Muted/Line aus dem Blog, Blau für Fokus/Auswahl, echte GitHub-
Dark-/Light-Paletten für Code. Keine weitere dekorative Farbwelt.

Der zentrale Bewegungsmoment trennt Textmaske und Farbbild räumlich. Ein Regler
steuert die Trennung direkt. Das ist ein Erklärmodell, keine Darstellung von
Browser-Compositing. Bei reduzierter Bewegung werden die Ebenen flach gezeigt.
Weitere Interaktionen erklären Zustandsänderungen ohne inszenierte Animationen.

Im ersten Widget bleibt der Code lesbar. Die vollständige HTML-Ausgabe wird
standardmäßig auf die rechte Fläche skaliert; mehr Code verkleinert den Zoom
und verdichtet das sichtbare HTML. Ein Button wechselt zur lesbaren Scrollansicht
und zurück. Zoom und unkomprimierte UTF-8-Größen stehen direkt an der Ausgabe.
Die Skalierung folgt dem Slider ohne Übergangsanimation, auch bei reduzierter
Bewegung. Farben, Schriften, Radien und Abstände bleiben im bestehenden System;
keine zusätzliche Token-Grafik oder dekorative Animation.

Editor, Ebenen und Pipeline teilen Quelle/Theme/Sprache. Der DOM-Vergleich zählt
echte Elemente bei identischen Tokens. Grenzfälle und verzögerte Bildupdates sind
gekennzeichnete Experimente. Eine isolierte Vorschauseite enthält kein Script.

Kurze Absätze nennen Schlussfolgerungen; vollständige Quellen sind aufklappbar.
Vorteile stehen im Vordergrund, Modellannahmen und offene Fragen direkt an der
betreffenden Abbildung. Keine simulierten Performancewerte, kein Scroll-Zwang.
