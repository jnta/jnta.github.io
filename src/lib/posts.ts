import { getCollection } from 'astro:content';
import type { PostCardData } from './types';

export type PostEntry = Awaited<ReturnType<typeof getSortedPosts>>[number];

const MONTHS = [
  'jan',
  'fev',
  'mar',
  'abr',
  'mai',
  'jun',
  'jul',
  'ago',
  'set',
  'out',
  'nov',
  'dez',
];

export function dateLabel(date: Date): string {
  return `${MONTHS[date.getMonth()]} ${date.getFullYear()}`;
}

function wordsOf(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

export function readingTime(body: string): string {
  const minutes = Math.max(1, Math.ceil(wordsOf(body) / 200));
  return `${minutes} min de leitura`;
}

export async function getSortedPosts() {
  const posts = (await getCollection('blog')).filter((p) => !p.data.draft);
  return posts
    .map((post) => ({ ...post, readingTime: readingTime(post.body ?? '') }))
    .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

export function toCardData(post: PostEntry): PostCardData {
  return {
    slug: post.id,
    title: post.data.title,
    description: post.data.description,
    date: post.data.date.toISOString(),
    dateLabel: dateLabel(post.data.date),
    category: post.data.category,
    tags: post.data.tags,
    stack: post.data.stack,
    topic: post.data.topic || post.data.category,
    cover: post.data.cover,
    readingTime: post.readingTime,
  };
}

export function listOf(posts: Awaited<ReturnType<typeof getSortedPosts>>, key: 'category') {
  return [...new Set(posts.map((p) => p.data[key]))].sort();
}

export function listOfTags(posts: Awaited<ReturnType<typeof getSortedPosts>>) {
  const tags = new Set<string>();
  for (const p of posts) for (const t of p.data.tags) tags.add(t);
  return [...tags].sort();
}

export function listOfStack(posts: Awaited<ReturnType<typeof getSortedPosts>>) {
  const stack = new Set<string>();
  for (const p of posts) for (const t of p.data.stack) stack.add(t);
  return [...stack].sort();
}
