import type { APIRoute } from 'astro';
import { getPublishedPosts, postUrl } from '../lib/posts';

const escapeXml = (value: string) => value.replace(/[<>&"']/g, char => ({
  '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', "'": '&apos;',
})[char]!);

export const GET: APIRoute = async ({ site }) => {
  const posts = await getPublishedPosts();
  const paths = ['/', ...posts.filter(post => !post.data.externalUrl).map(postUrl)];
  const urls = paths.map(path => `<url><loc>${escapeXml(new URL(path, site).href)}</loc></url>`);
  return new Response(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.join('')}</urlset>`, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
