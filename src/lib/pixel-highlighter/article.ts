import type { Language, Options, Theme } from './raster';

type Rendering = ReturnType<(typeof import('./browser'))['browserBackground']>;
const get = <T extends Element = HTMLElement>(root: ParentNode, selector: string) => {
  const element = root.querySelector<T>(selector);
  if (!element) throw new Error(`Missing demo element: ${selector}`);
  return element;
};
const say = (root: ParentNode, selector: string, text: string) => { get(root, selector).textContent = text; };

function paint(element: HTMLElement, result: Rendering) {
  element.style.setProperty('--pixel-image', `url(${result.image})`);
  element.style.setProperty('--pixel-size', result.size);
  element.dataset.ready = '';
}
function palette(element: HTMLElement, result: Rendering) {
  element.style.setProperty('--pixel-bg', result.background);
  element.style.setProperty('--pixel-fg', result.foreground);
}
async function decoded(result: Rendering) {
  const image = new Image();
  image.src = result.image;
  await image.decode();
}

export async function initializeArticle() {
  if (!document.querySelector('[data-playground]')) return;
  const playground = get<HTMLElement>(document, '[data-playground]');
  const editor = get<HTMLTextAreaElement>(playground, 'textarea');
  const initial = editor.defaultValue;
  const status = get(playground, '#playground-state');
  // Input stays readable even while the separately loaded tokenizer is pending.
  const invalidate = () => { delete editor.dataset.ready; };
  editor.addEventListener('input', invalidate);
  try {
    // Load the real tokenizer separately from the article controls and HTML.
    const { browserBackground } = await import('./browser');
    const layers = get<HTMLElement>(document, '[data-layers]');
    const pipeline = get<HTMLElement>(document, '[data-pipeline]');
    const comparison = get<HTMLElement>(document, '[data-comparison]');
    const stage = get<HTMLElement>(layers, '.pixel-layer-stage');
    const separation = get<HTMLInputElement>(layers, '#layer-separation');
    const column = get<HTMLInputElement>(layers, '#layer-column');
    const layerCode = get<HTMLElement>(layers, 'code');
    const layerImage = get<HTMLElement>(layers, '.pixel-color-cells');
    const pipelineCode = get<HTMLElement>(pipeline, '[data-pipeline-code]');
    const picture = get<HTMLElement>(pipeline, '[data-pipeline-picture]');
    const tabs = [...pipeline.querySelectorAll<HTMLButtonElement>('[role="tab"]')];
    const copies = get<HTMLInputElement>(comparison, '#code-copies');
    let options: Options = { theme: 'dark', language: 'javascript' };
    let source = initial;
    let result: Rendering | undefined;
    let errorMessage = '';
    let selectedStage = 'source';
    let revision = 0;
    let frame = 0;
    let composing = false;
    const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');

    function inspectCell() {
      const firstLine = source.split('\n')[0];
      column.max = String(Math.max(1, Math.min(firstLine.length, 42)));
      if (+column.value > +column.max) column.value = column.max;
      const x = +column.value - 1;
      stage.style.setProperty('--cell-x', String(x));
      const character = firstLine[x];
      const swatch = result ? [...result.data.slice(x * 4, x * 4 + 3)].join(', ') : '';
      say(layers, '[data-cell-value]', `Column ${x + 1} · ${character === ' ' ? 'space' : character ? `“${character}”` : 'empty'}${swatch ? ` · RGB ${swatch}` : ''}`);
    }

    function separate() {
      const value = +separation.value / 100;
      stage.style.setProperty('--split', String(value));
      stage.style.setProperty('--lift', `${value * 110}px`);
      stage.style.setProperty('--tilt', `${value * 44}deg`);
      stage.style.setProperty('--turn', `${value * -13}deg`);
      stage.style.setProperty('--mask-color', value > 0.15 ? 'var(--pixel-fg)' : 'transparent');
      stage.dataset.flat = String(reducedMotion.matches);
      say(layers, '[data-separation-value]', `${Math.round(value * 100)}%`);
      say(layers, '[data-toggle-layers]', value > 0 ? 'Combine layers' : 'Separate layers');
    }
    separation.addEventListener('input', separate);
    reducedMotion.addEventListener('change', separate);
    column.addEventListener('input', inspectCell);
    get(layers, '[data-toggle-layers]').addEventListener('click', () => { separation.value = +separation.value > 0 ? '0' : '100'; separate(); });
    get(playground, '[data-reveal]').addEventListener('click', () => { separation.value = '100'; separate(); });
    separate();

    function showPipeline() {
      tabs.forEach(tab => {
        const active = tab.dataset.stage === selectedStage;
        tab.setAttribute('aria-selected', String(active));
        tab.tabIndex = active ? 0 : -1;
      });
      get(pipeline, '[role="tabpanel"]').setAttribute('aria-labelledby', `stage-${selectedStage}`);
      const imageStage = selectedStage === 'pixels' || selectedStage === 'png';
      pipelineCode.hidden = imageStage && !!result;
      picture.hidden = !imageStage || !result;
      let caption = 'The original source. Editing changes its value, not a tree of token elements.';
      if (selectedStage === 'source') pipelineCode.textContent = source || '(empty source)';
      else if (!result) {
        pipelineCode.textContent = errorMessage || 'Waiting for a color image.';
        caption = 'The editor remains readable when highlighting is unavailable.';
      } else if (selectedStage === 'tokens') {
        const tokens = result.tokens.flat();
        pipelineCode.textContent = JSON.stringify(tokens.slice(0, 20), null, 2);
        caption = `Shiki supplies text and color. Showing ${Math.min(20, tokens.length)} of ${tokens.length} tokens; token font styles are not used.`;
      } else {
        get<HTMLImageElement>(picture, 'img').src = result.image;
        picture.dataset.view = selectedStage;
        const download = get<HTMLAnchorElement>(picture, '[data-png-download]');
        download.href = result.image;
        download.hidden = selectedStage !== 'png';
        caption = selectedStage === 'pixels'
          ? `${result.width} × ${result.height} cells. Each pixel carries a color; transparent cells fill shorter lines. Enlarged with nearest-neighbor scaling.`
          : `${result.bytes.toLocaleString('en')} bytes of PNG for this source in this browser. This is the image size, not the full HTML or a compressed transfer comparison.`;
      }
      say(pipeline, '[data-pipeline-caption]', caption);
    }
    tabs.forEach((tab, index) => {
      tab.addEventListener('click', () => { selectedStage = tab.dataset.stage!; showPipeline(); });
      tab.addEventListener('keydown', event => {
        let next = index;
        if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
        else if (event.key === 'ArrowLeft') next = (index + tabs.length - 1) % tabs.length;
        else if (event.key === 'Home') next = 0;
        else if (event.key === 'End') next = tabs.length - 1;
        else return;
        event.preventDefault();
        tabs[next].click(); tabs[next].focus();
      });
    });

    function compare() {
      const spanCode = get<HTMLElement>(comparison, '[data-span-code]');
      const pixelCode = get<HTMLElement>(comparison, '[data-comparison-code]');
      say(comparison, '[data-copies-value]', copies.value);
      const repeated = Array.from({ length: +copies.value }, () => source).join('\n\n');
      try {
        const shared = browserBackground(repeated, options);
        const fragment = document.createDocumentFragment();
        shared.tokens.forEach((line, y) => {
          for (const token of line) {
            if (!token.content) continue;
            const span = document.createElement('span');
            span.textContent = token.content; span.style.color = token.color;
            fragment.append(span);
          }
          if (y < shared.tokens.length - 1) fragment.append('\n');
        });
        spanCode.replaceChildren(fragment);
        pixelCode.textContent = repeated;
        paint(pixelCode, shared); palette(comparison, shared);
        const spanCount = spanCode.parentElement!.querySelectorAll('*').length + 1;
        const pixelCount = pixelCode.parentElement!.querySelectorAll('*').length + 1;
        say(comparison, '[data-span-count]', spanCount.toLocaleString('en'));
        say(comparison, '[data-pixel-count]', String(pixelCount));
        get<HTMLElement>(comparison, '[data-span-bar]').style.width = '100%';
        get<HTMLElement>(comparison, '[data-pixel-bar]').style.width = `${Math.max(1, pixelCount / spanCount * 100)}%`;
        say(comparison, '[data-comparison-caption]', `${shared.height} ${shared.height === 1 ? 'line' : 'lines'}, identical Shiki tokens and colors. Counts include pre, code and token spans; controls and labels are excluded. DOM size is not a speed measurement.`);
      } catch (error) {
        spanCode.textContent = pixelCode.textContent = source;
        delete pixelCode.dataset.ready;
        say(comparison, '[data-span-count]', '—'); say(comparison, '[data-pixel-count]', '—');
        get<HTMLElement>(comparison, '[data-span-bar]').style.width = '0';
        get<HTMLElement>(comparison, '[data-pixel-bar]').style.width = '0';
        say(comparison, '[data-comparison-caption]', `${error instanceof Error ? error.message : 'Comparison unavailable.'} Reduce code copies or reset the editor to compare supported input.`);
      }
    }
    copies.addEventListener('input', compare);

    async function update(version: number) {
      source = editor.value;
      try {
        const next = browserBackground(source, options);
        await decoded(next);
        if (version !== revision) return;
        result = next; errorMessage = '';
        paint(editor, next); palette(playground, next); palette(layers, next);
        paint(layerCode, next);
        layerImage.style.backgroundImage = `url(${next.image})`;
        layerImage.style.backgroundSize = next.size;
        stage.removeAttribute('data-unavailable');
        stage.style.setProperty('--shown-columns', String(Math.max(24, Math.min(next.width, 42))));
        say(layers, '[data-layer-info]', `${next.width} × ${next.height} pixels. Showing up to 42 columns and 7 lines of the same source.`);
        say(playground, '[data-image-info]', `${next.width} × ${next.height} px · ${next.bytes} B PNG`);
        status.textContent = 'Shiki tokens · ASCII, no tabs · up to 512 columns / 100 lines';
      } catch (error) {
        if (version !== revision) return;
        result = undefined;
        errorMessage = error instanceof Error ? error.message : 'Highlighting unavailable. Text remains editable.';
        delete editor.dataset.ready; delete layerCode.dataset.ready;
        layerImage.style.backgroundImage = 'none';
        stage.dataset.unavailable = '';
        say(layers, '[data-layer-info]', 'No color image for this input. The text remains available.');
        say(playground, '[data-image-info]', 'Plain text fallback');
        status.textContent = errorMessage;
      }
      layerCode.textContent = source;
      inspectCell(); showPipeline(); compare();
    }
    function schedule() {
      const version = ++revision;
      delete editor.dataset.ready;
      cancelAnimationFrame(frame);
      if (!composing) frame = requestAnimationFrame(() => { void update(version); });
    }
    editor.addEventListener('input', schedule);
    editor.removeEventListener('input', invalidate);
    editor.addEventListener('compositionstart', () => { composing = true; schedule(); });
    editor.addEventListener('compositionend', () => { composing = false; schedule(); });
    get<HTMLSelectElement>(playground, '[data-theme]').addEventListener('change', event => {
      options.theme = (event.target as HTMLSelectElement).value as Theme; schedule();
    });
    get<HTMLSelectElement>(playground, '[data-language]').addEventListener('change', event => {
      options.language = (event.target as HTMLSelectElement).value as Language; schedule();
    });
    get(playground, '[data-reset]').addEventListener('click', () => { editor.value = initial; editor.scrollTop = editor.scrollLeft = 0; schedule(); });
    schedule();

    initializeBoundaries(browserBackground);
    initializeUpdates(browserBackground, initial);
  } catch (error) {
    console.error('Pixel highlighter initialization failed:', error);
    status.textContent = 'The live tokenizer could not load. Reload to retry; the initial text remains available.';
    delete editor.dataset.ready;
  }
}

function initializeBoundaries(render: (source: string, options?: Options) => Rendering) {
  const root = get<HTMLElement>(document, '[data-boundaries]');
  const select = get<HTMLSelectElement>(root, 'select');
  const code = get<HTMLElement>(root, '[data-boundary-code]');
  const base = `const message = "A deliberately long string";\nconst answer = 42;\nconsole.log(message, answer);`;
  const descriptions: Record<string, string> = {
    aligned: 'Aligned: one image row per source line. Every ASCII character occupies one cell.',
    wrap: 'Wrapping creates visual lines that have no matching image row. Resizing requires reflowing the color map too.',
    tab: 'A tab advances to a tab stop. Counting it as one cell shifts the colors that follow it. This view uses tab-size: 4.',
    unicode: 'The emoji sequence uses multiple UTF-16 units but fewer visible columns. String.length is not a general column count.',
    metrics: 'The text now uses a 2.2em line height, while the image still uses 1.6em. Each following line drifts further.',
  };
  function update() {
    const scenario = select.value;
    const source = scenario === 'tab' ? `const message = "Hello";\n\tconst answer = 42;\nconsole.log(message, answer);`
      : scenario === 'unicode' ? `const icon = "👩‍💻"; const answer = 42;\nconsole.log(icon, answer);` : base;
    // Intentionally incorrect: one placeholder per UTF-16 unit, or per tab.
    // Only this teaching experiment bypasses the editor's safe input policy.
    const naive = source.replace(/[^\x20-\x7e\n]/g, '?');
    const result = render(naive);
    code.textContent = source; paint(code, result); palette(root, result);
    root.dataset.scenario = scenario;
    say(root, '[data-boundary-caption]', descriptions[scenario]);
  }
  select.addEventListener('change', update); update();
}

function initializeUpdates(render: (source: string) => Rendering, initial: string) {
  const root = get<HTMLElement>(document, '[data-updates]');
  const editor = get<HTMLTextAreaElement>(root, 'textarea');
  const old = get<HTMLElement>(root, '[data-old-colors]');
  const delay = get<HTMLInputElement>(root, '#image-latency');
  let textRevision = 0;
  let imageRevision = 0;
  let timer: ReturnType<typeof setTimeout>;
  let composing = false;
  function labels(waiting: boolean) {
    say(root, '[data-old-revision]', `Text ${textRevision} · image ${imageRevision}`);
    say(root, '[data-new-revision]', `Text ${textRevision} · ${waiting ? 'plain text' : `image ${imageRevision}`}`);
  }
  const first = render(initial);
  paint(old, first); paint(editor, first); palette(root, first);
  function schedule() {
    const version = ++textRevision;
    clearTimeout(timer);
    old.textContent = editor.value;
    // Keep both views scrolled to the same part of the same source.
    old.parentElement!.scrollTop = editor.scrollTop;
    old.parentElement!.scrollLeft = editor.scrollLeft;
    delete editor.dataset.ready;
    labels(true);
    if (composing) return;
    say(root, '[data-update-status]', `Waiting ${delay.value} ms before decoding and applying revision ${version}.`);
    timer = setTimeout(async () => {
      try {
        const next = render(editor.value);
        await decoded(next);
        if (version !== textRevision) return;
        paint(old, next); paint(editor, next);
        imageRevision = version; labels(false);
        say(root, '[data-update-status]', 'Text and color image now describe the same revision. Older results cannot overwrite newer input.');
      } catch (error) {
        if (version !== textRevision) return;
        delete old.dataset.ready;
        say(root, '[data-update-status]', error instanceof Error ? error.message : 'Colors unavailable; text remains readable.');
        labels(true);
      }
    }, +delay.value);
  }
  editor.addEventListener('input', schedule);
  editor.addEventListener('compositionstart', () => { composing = true; schedule(); });
  editor.addEventListener('compositionend', () => { composing = false; schedule(); });
  editor.addEventListener('scroll', () => {
    old.parentElement!.scrollTop = editor.scrollTop;
    old.parentElement!.scrollLeft = editor.scrollLeft;
  });
  get(root, '[data-insert-line]').addEventListener('click', () => { editor.value = '// A newly inserted line\n' + editor.value; schedule(); });
  delay.addEventListener('input', () => { say(root, '[data-latency-value]', `${delay.value} ms`); schedule(); });
}
