import { createHighlighterCoreSync } from '@shikijs/core';
import { createJavaScriptRegexEngine } from '@shikijs/engine-javascript';
import javascript from '@shikijs/langs/javascript';
import typescript from '@shikijs/langs/typescript';
import githubDark from '@shikijs/themes/github-dark-default';
import githubLight from '@shikijs/themes/github-light-default';

export const sample = `const message = "Hello, pixels!";

function greet(name) {
  return message + " " + name;
}

greet("browser");`;

export type Theme = 'dark' | 'light';
export type Language = 'javascript' | 'typescript';
export type Options = { theme?: Theme; language?: Language };
export type ColorToken = { content: string; color: string };
let highlighter: ReturnType<typeof createHighlighterCoreSync> | undefined;

export function rasterize(source: string, options: Options = {}) {
  // UTF-16 length is a cell count only for this deliberately bounded input set.
  if (/[^\x20-\x7e\n]/.test(source)) {
    throw new Error('Highlighting supports ASCII and newlines. Tabs and Unicode stay readable in plain text.');
  }
  const lines = source.split('\n');
  if (lines.length > 100 || lines.some(line => line.length > 512)) {
    throw new Error('Highlighting is limited to 100 lines and 512 columns. Text remains editable.');
  }
  const width = Math.max(1, ...lines.map(line => line.length));
  const height = lines.length;
  highlighter ??= createHighlighterCoreSync({
    engine: createJavaScriptRegexEngine(),
    langs: [javascript, typescript], themes: [githubDark, githubLight],
  });
  const theme = options.theme === 'light' ? 'github-light-default' : 'github-dark-default';
  const definition = highlighter.getTheme(theme);
  const foreground = definition.fg;
  const background = definition.bg;
  const tokens: ColorToken[][] = highlighter.codeToTokensBase(source, {
    lang: options.language ?? 'javascript', theme,
  }).map(line => line.map(token => ({ content: token.content, color: token.color ?? foreground })));
  const data = new Uint8Array(width * height * 4);
  tokens.forEach((line, y) => {
    let x = 0;
    for (const token of line) {
      const hex = token.color.replace('#', '');
      const rgb = [0, 2, 4].map(offset => parseInt(hex.slice(offset, offset + 2), 16));
      const alpha = hex.length === 8 ? parseInt(hex.slice(6, 8), 16) : 255;
      for (let i = 0; i < token.content.length; i++, x++) {
        data.set([...rgb, alpha], (y * width + x) * 4);
      }
    }
  });
  return { width, height, data, tokens, foreground, background, size: `${width}ch ${height * 1.6}em` };
}
