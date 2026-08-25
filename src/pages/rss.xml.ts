import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { excerpt, postPath, sortPosts } from '../lib/posts';

export async function GET(context: { site: URL | undefined }) {
  const posts = sortPosts(await getCollection('blog', ({ data }) => !data.draft));
  return rss({
    title: 'JACL Blog',
    description: '关于工程、游戏开发与技术实践的个人笔记。',
    site: context.site ?? 'https://blog.lxp520.top',
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.date,
      description: excerpt(post, 180),
      link: postPath(post),
      categories: [...post.data.categories, ...post.data.tags]
    })),
    customData: '<language>zh-CN</language>'
  });
}
