import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    category: z.string(),
    tags: z.array(z.string()).default([]),
    stack: z.array(z.string()).default([]),
    topic: z.string().default(''),
    cover: z.string().default('note'),
    math: z.boolean().default(false),
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog };
