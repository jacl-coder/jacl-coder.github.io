import type { CollectionEntry } from 'astro:content';

export type BlogPost = CollectionEntry<'blog'>;

export const sortPosts = (posts: BlogPost[]) =>
  [...posts].sort((a, b) => b.data.date.getTime() - a.data.date.getTime());

export const formatDate = (date: Date) =>
  new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC'
  }).format(date);

export const postPath = (post: BlogPost) => `/posts/${post.id}/`;

const stripMarkdown = (value: string) =>
  value
    .replace(/^---[\s\S]*?---/m, '')
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/<[^>]+>/g, ' ')
    .replace(/[#>*_~|\-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

export const excerpt = (post: BlogPost, length = 120) => {
  const text = post.data.description ?? stripMarkdown(post.body ?? '');
  return text.length > length ? `${text.slice(0, length).trim()}…` : text;
};

export const readingMinutes = (post: BlogPost) => {
  const text = stripMarkdown(post.body ?? '');
  const chineseCharacters = (text.match(/[\u3400-\u9fff]/g) ?? []).length;
  const latinWords = (text.replace(/[\u3400-\u9fff]/g, ' ').match(/[A-Za-z0-9]+/g) ?? []).length;
  return Math.max(1, Math.ceil((chineseCharacters + latinWords) / 300));
};

export const uniqueTags = (posts: BlogPost[]) =>
  [...new Set(posts.flatMap((post) => post.data.tags))].sort((a, b) =>
    a.localeCompare(b, 'zh-CN')
  );

export const uniqueCategories = (posts: BlogPost[]) =>
  [...new Set(posts.flatMap((post) => post.data.categories))].sort((a, b) =>
    a.localeCompare(b, 'zh-CN')
  );

export const tagPath = (tag: string) => `/tags/${encodeURIComponent(tag)}/`;
export const topicPath = (topic: string) => `/topics/${encodeURIComponent(topic)}/`;
