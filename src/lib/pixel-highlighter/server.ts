import { encode } from 'fast-png';
import { Buffer } from 'node:buffer';
import { rasterize } from './raster';

export function serverBackground(source: string) {
  const { width, height, data, size } = rasterize(source);
  const png = encode({ width, height, data, channels: 4 });
  return { image: `data:image/png;base64,${Buffer.from(png).toString('base64')}`, size, width, height };
}
