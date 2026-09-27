import { getCollection, type CollectionEntry } from 'astro:content';

export async function getPublishedPosts() {
  const posts = await getCollection('blog', ({ data }) =>
    !data.draft && data.date.getTime() <= Date.now(),
  );
  return posts.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

export function postUrl(post: CollectionEntry<'blog'>) {
  return post.data.externalUrl ?? `/blog/${post.id}/`;
}

export function formatDate(date: Date) {
  return new Intl.DateTimeFormat('en', {
    month: 'short', year: 'numeric', timeZone: 'UTC',
  }).format(date);
}
