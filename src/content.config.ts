import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: ({ image }) => z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    lang: z.enum(['en', 'de']).default('en'),
    draft: z.boolean().default(false),
    externalUrl: z.url().optional(),
    source: z.string().optional(),
    gallery: z.array(z.object({ src: image(), alt: z.string() })).default([]),
    preview: z.object({
      image: image(),
      alt: z.string(),
      title: z.string(),
      readingTime: z.string(),
    }).optional(),
  }),
});

export const collections = { blog };
