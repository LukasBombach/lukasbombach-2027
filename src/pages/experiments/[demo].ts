import { serverBackground } from '../../lib/pixel-highlighter/server';
import { sample } from '../../lib/pixel-highlighter/raster';
import pixelStyles from '../../components/pixel-highlighter/pixel.css?raw';

export function getStaticPaths() {
  // This demonstration follows the article's draft visibility.
  return import.meta.env.DEV ? [{ params: { demo: 'pixel-highlighter' } }] : [];
}

export function GET() {
  const result = serverBackground(sample);
  const text = sample.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
  // A raw HTML endpoint also avoids development-only scripts injected by Astro.
  return new Response(`<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex"><meta name="color-scheme" content="light dark">
<title>A syntax color image, without scripts</title>
<style>
:root { --color-line:#ddd; --color-muted:#666; color-scheme:light dark; }
body { margin:0; font:16px/1.8 system-ui,sans-serif; }
main { max-width:600px; margin:64px auto; padding:0 24px; }
h1 { font-size:28px; line-height:1.4; font-weight:500; }
pre { overflow:auto; border-radius:8px; }
a { color:inherit; text-underline-offset:4px; }
${pixelStyles}
</style></head><body><main class="prose" id="main">
<h1>A syntax color image, without scripts</h1>
<p>This page contains no scripts. The server generates a PNG containing the
syntax colors; CSS clips it to the original text inside a pre and code.</p>
<pre class="pixel-shell" style="background-color:${result.background}"><code class="pixel-text" data-ready style="--pixel-image:url(${result.image});--pixel-size:${result.size}">${text}</code></pre>
<p>Select and copy the code, or reload with JavaScript disabled. The text and
its colors are already in the delivered HTML.</p>
<p><a href="/blog/syntax-highlighting-with-just-two-elements/#generate-it-before-it-reaches-the-browser">Back to the article</a></p>
</main></body></html>`, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
}
