// Deliberately small teaching lexer, NOT a JavaScript parser.
export const sample = `// Colors without token elements
const greeting = "Hello, browser!";
function repeat(times) {
  return greeting + times;
}
repeat(42);`;

export function rasterize(source: string) {
  if (/[^\x20-\x7e\n]/.test(source)) {
    throw new Error('This demo supports only printable ASCII and newlines, no tabs.');
  }
  const lines = source.split('\n');
  const width = Math.max(1, ...lines.map(line => line.length));
  const height = lines.length;
  if (width > 512 || height > 100) {
    throw new Error('Demo limit: 512 columns and 100 lines.');
  }
  const data = new Uint8Array(width * height * 4);
  // Comments, quoted strings, numbers, identifiers, then any remaining character.
  const lexer = /\/\/[^\n]*|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\b\d+(?:\.\d+)?\b|[A-Za-z_$][\w$]*|./g;
  const keywords = new Set(['const', 'let', 'function', 'return', 'if', 'else']);
  const colors = {
    plain: [226, 232, 240], comment: [148, 163, 184],
    string: [134, 239, 172], number: [253, 186, 116], keyword: [196, 181, 253],
  };
  lines.forEach((line, y) => {
    let x = 0;
    for (const [token] of line.matchAll(lexer)) {
      const kind = token.startsWith('//') ? 'comment'
        : /^["']/.test(token) ? 'string'
        : /^\d/.test(token) ? 'number'
        : keywords.has(token) ? 'keyword' : 'plain';
      for (let i = 0; i < token.length; i++, x++) {
        data.set([...colors[kind], 255], (y * width + x) * 4);
      }
    }
  });
  return { width, height, data, size: `${width}ch ${height * 1.6}em` };
}
