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

export function domTextSize(text: string) {
  const bytes = new TextEncoder().encode(text).byteLength;
  return bytes < 1000 ? `${bytes} B` : `${(bytes / 1000).toFixed(1)} kB`;
}

export function initializeDomIntro(render: (source: string) => Rendering) {
  const root = document.querySelector<HTMLElement>('[data-dom-intro]');
  if (!root) return;
  const slider = root.querySelector<HTMLInputElement>('input[type="range"]')!;
  const code = root.querySelector<HTMLElement>('[data-dom-source]')!;
  const html = root.querySelector<HTMLElement>('[data-dom-html]')!;
  const view = root.querySelector<HTMLElement>('[data-dom-html-view]')!;
  const toggle = root.querySelector<HTMLButtonElement>('[data-dom-toggle-view]')!;
  const zoomLabel = root.querySelector<HTMLOutputElement>('[data-dom-zoom]')!;
  const status = root.querySelector<HTMLElement>('[data-dom-status]')!;
  let lastLines = slider.value;
  let frame = 0;
  let fitFrame = 0;

  const fitHtml = () => {
    if (view.dataset.view !== 'overview') return;
    const width = view.clientWidth - 40;
    const height = view.clientHeight - 32;
    if (width <= 0 || height <= 0) return;
    const fits = (zoom: number) => {
      // Widen the unscaled text as we zoom out so it fills the available width.
      // Wrapping changes only its display, never the serialized HTML.
      html.style.setProperty('--dom-layout-width', `${width / zoom}px`);
      html.style.setProperty('--dom-zoom', String(zoom));
      return html.scrollHeight * zoom <= height;
    };
    let zoom = 1;
    if (!fits(1)) {
      let lower = 0.001;
      let upper = 1;
      for (let i = 0; i < 12; i++) {
        const candidate = (lower + upper) / 2;
        if (fits(candidate)) lower = candidate;
        else upper = candidate;
      }
      zoom = lower;
      fits(zoom);
    }
    zoomLabel.textContent = ` · All HTML · ${Math.round(zoom * 100)}% zoom`;
  };
  const queueFit = () => {
    cancelAnimationFrame(fitFrame);
    fitFrame = requestAnimationFrame(fitHtml);
  };
  const setView = (overview: boolean) => {
    view.dataset.view = overview ? 'overview' : 'read';
    view.tabIndex = overview ? -1 : 0;
    view.scrollTop = 0;
    view.scrollLeft = 0;
    toggle.textContent = overview ? 'Read HTML' : 'Show all HTML';
    if (overview) fitHtml();
    else zoomLabel.textContent = ' · 100% zoom';
  };
  toggle.addEventListener('click', () => setView(view.dataset.view !== 'overview'));
  setView(true);
  toggle.hidden = false;
  zoomLabel.hidden = false;
  new ResizeObserver(queueFit).observe(view);
  void document.fonts.ready.then(queueFit);
  slider.disabled = false;
  const update = () => {
    try {
      const source = domSource(+slider.value);
      const result = render(source);
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
      root.querySelector('[data-dom-code-size]')!.textContent = domTextSize(source);
      root.querySelector('[data-dom-html-size]')!.textContent = domTextSize(html.textContent);
      fitHtml();
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
