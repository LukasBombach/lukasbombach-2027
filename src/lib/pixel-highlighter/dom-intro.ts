import type { ColorToken } from './raster';

type Rendering = ReturnType<(typeof import('./browser'))['browserBackground']>;

export function domSource(lines: number) {
  return Array.from({ length: lines }, (_, i) => `const value${i + 1} = Math.max(0, ${i + 1}) + 1;`).join('\n');
}

export function highlightedHtml(tokens: ColorToken[][]) {
  const escape = (text: string) => text.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
  const content = tokens.map(line => line.filter(token => token.content).map(token =>
    `<span style="color:${escape(token.color).replaceAll('"', '&quot;')}">${escape(token.content)}</span>`).join('')).join('\n');
  return `<pre><code>${content}</code></pre>`;
}

export function tokenMosaic(tokens: ColorToken[][]) {
  const spans = tokens.flat().filter(token => token.content);
  const columns = 64;
  const width = columns * 3;
  const height = Math.max(1, Math.ceil(spans.length / columns)) * 3;
  const data = new Uint8Array(width * height * 4);
  for (let p = 0; p < width * height; p++) data.set([13, 17, 23, 255], p * 4);
  spans.forEach((token, i) => {
    const rgb = [1, 3, 5].map(offset => parseInt(token.color.slice(offset, offset + 2), 16));
    const x = i % columns * 3;
    const y = Math.floor(i / columns) * 3;
    for (let dy = 0; dy < 2; dy++) {
      for (let dx = 0; dx < 2; dx++) data.set([...rgb, 255], ((y + dy) * width + x + dx) * 4);
    }
  });
  return { width, height, data };
}

export function initializeDomIntro(render: (source: string) => Rendering) {
  const root = document.querySelector<HTMLElement>('[data-dom-intro]');
  if (!root) return;
  const slider = root.querySelector<HTMLInputElement>('input[type="range"]')!;
  const code = root.querySelector<HTMLElement>('[data-dom-source]')!;
  const html = root.querySelector<HTMLElement>('[data-dom-html]')!;
  const image = root.querySelector<HTMLImageElement>('[data-dom-mosaic]')!;
  const status = root.querySelector<HTMLElement>('[data-dom-status]')!;
  let lastLines = slider.value;
  let frame = 0;
  slider.disabled = false;
  const update = () => {
    try {
      const result = render(domSource(+slider.value));
      const mosaic = tokenMosaic(result.tokens);
      const canvas = document.createElement('canvas');
      canvas.width = mosaic.width; canvas.height = mosaic.height;
      const context = canvas.getContext('2d');
      if (!context) throw new Error('Canvas unavailable.');
      context.putImageData(new ImageData(new Uint8ClampedArray(mosaic.data), mosaic.width, mosaic.height), 0, 0);
      const png = canvas.toDataURL('image/png');
      const fragment = document.createDocumentFragment();
      result.tokens.forEach((line, y) => {
        for (const token of line) {
          if (!token.content) continue;
          const span = document.createElement('span');
          span.style.color = token.color; span.textContent = token.content;
          fragment.append(span);
        }
        if (y < result.tokens.length - 1) fragment.append('\n');
      });
      code.replaceChildren(fragment);
      const count = code.querySelectorAll('span').length;
      const elements = code.parentElement!.querySelectorAll('*').length + 1;
      root.querySelector('[data-dom-lines]')!.textContent = slider.value;
      root.querySelector('[data-dom-line-value]')!.textContent = slider.value;
      root.querySelector('[data-dom-line-label]')!.textContent = slider.value === '1' ? 'line of code' : 'lines of code';
      root.querySelector('[data-dom-spans]')!.textContent = count.toLocaleString('en');
      root.querySelector('[data-dom-total]')!.textContent = elements.toLocaleString('en');
      html.textContent = highlightedHtml(result.tokens);
      image.src = png; image.width = mosaic.width; image.height = mosaic.height;
      image.alt = `${count.toLocaleString('en')} squares, one per token span in the highlighted block`;
      lastLines = slider.value;
      status.textContent = `${slider.value} ${slider.value === '1' ? 'line of code creates' : 'lines of code create'} ${count.toLocaleString('en')} token spans and ${elements.toLocaleString('en')} elements in this renderer.`;
    } catch {
      slider.value = lastLines;
      status.textContent = 'The example could not update. The previous count and rendering are still shown.';
    }
  };
  slider.addEventListener('input', () => {
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(update);
  });
}
