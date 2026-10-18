import { rasterize, type Options } from './raster';

export function browserBackground(source: string, options: Options = {}) {
  const raster = rasterize(source, options);
  const { width, height, data } = raster;
  const canvas = document.createElement('canvas'); // Never attached to the DOM.
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext('2d');
  if (!context) throw new Error('Canvas is unavailable.');
  context.putImageData(new ImageData(new Uint8ClampedArray(data), width, height), 0, 0);
  const image = canvas.toDataURL('image/png');
  return { ...raster, image, bytes: atob(image.split(',')[1]).length };
}
