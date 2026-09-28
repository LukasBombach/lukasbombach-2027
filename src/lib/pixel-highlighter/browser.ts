import { rasterize } from './raster';

export function browserBackground(source: string) {
  const { width, height, data, size } = rasterize(source);
  const canvas = document.createElement('canvas'); // Never attached to the DOM.
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext('2d');
  if (!context) throw new Error('Canvas ist nicht verfügbar.');
  context.putImageData(new ImageData(new Uint8ClampedArray(data), width, height), 0, 0);
  return { image: canvas.toDataURL('image/png'), size, width, height };
}
