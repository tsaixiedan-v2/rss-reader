import Parser from 'rss-parser';
import type { Feed, Article } from '../models/types';

const parser = new Parser({
  timeout: 10000,
  headers: { 'User-Agent': 'rss-reader/1.0' },
});

type RawFeed = Omit<Feed, 'id' | 'created_at'>;
type RawArticle = Omit<Article, 'id' | 'feed_id' | 'created_at' | 'is_read'>;

export interface ParsedFeed {
  feed: RawFeed;
  articles: RawArticle[];
}

export async function parseFeed(url: string): Promise<ParsedFeed> {
  const parsed = await parser.parseURL(url);

  const feed: RawFeed = {
    url,
    title: parsed.title || url,
    description: parsed.description,
    site_url: parsed.link,
    favicon_url: getFaviconUrl(parsed.link),
    last_fetched_at: new Date().toISOString(),
  };

  const articles: RawArticle[] = (parsed.items || []).map(item => ({
    guid: item.guid || item.link || item.title || String(Date.now() + Math.random()),
    title: item.title || 'Untitled',
    link: item.link,
    summary: item.contentSnippet || item.summary,
    content: (item as any)['content:encoded'] || item.content,
    author: item.creator || item.author,
    published_at: item.isoDate || item.pubDate,
  }));

  return { feed, articles };
}

function getFaviconUrl(siteUrl?: string): string | undefined {
  if (!siteUrl) return undefined;
  try {
    const { protocol, hostname } = new URL(siteUrl);
    return `${protocol}//${hostname}/favicon.ico`;
  } catch {
    return undefined;
  }
}
