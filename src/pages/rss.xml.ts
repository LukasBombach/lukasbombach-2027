import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getPublishedPosts, postUrl } from '../lib/posts';
import { profile } from '../data/profile';

export async function GET(context: APIContext) {
  const posts = await getPublishedPosts();
  return rss({
    title: `${profile.name} — Writing`,
    description: profile.about,
    site: context.site!,
    items: posts.map(post => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.date,
      link: postUrl(post),
    })),
  });
}
