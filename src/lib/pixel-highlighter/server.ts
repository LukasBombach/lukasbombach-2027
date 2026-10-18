import { encode } from 'fast-png';
import { Buffer } from 'node:buffer';
import { rasterize, type Options } from './raster';

export function serverBackground(source: string, options: Options = {}) {
  const raster = rasterize(source, options);
  const { width, height, data } = raster;
  const png = encode({ width, height, data, channels: 4 });
  return { ...raster, image: `data:image/png;base64,${Buffer.from(png).toString('base64')}`, bytes: png.length };
}
