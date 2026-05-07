import db from '../../resources/config/database';
import { parseFeed } from '../core/rssParser';
import type { Feed } from '../models/types';

export async function addFeed(url: string): Promise<Feed> {
  const { feed, articles } = await parseFeed(url);

  const feedRow = db.prepare(
    'INSERT INTO feeds (url, title, description, site_url, favicon_url, last_fetched_at) VALUES (?, ?, ?, ?, ?, ?)'
  ).run(feed.url, feed.title, feed.description ?? null, feed.site_url ?? null, feed.favicon_url ?? null, feed.last_fetched_at ?? null);

  const feedId = Number(feedRow.lastInsertRowid);

  const insertArticle = db.prepare(
    'INSERT OR IGNORE INTO articles (feed_id, guid, title, link, summary, content, author, published_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
  );

  db.exec('BEGIN');
  try {
    for (const a of articles) {
      insertArticle.run(feedId, a.guid, a.title, a.link ?? null, a.summary ?? null, a.content ?? null, a.author ?? null, a.published_at ?? null);
    }
    db.exec('COMMIT');
  } catch (e) {
    db.exec('ROLLBACK');
    throw e;
  }

  return getFeedById(feedId)!;
}

export function getAllFeeds(): Feed[] {
  return db.prepare(`
    SELECT f.*, COUNT(CASE WHEN a.is_read = 0 THEN 1 END) as unread_count
    FROM feeds f
    LEFT JOIN articles a ON a.feed_id = f.id
    GROUP BY f.id
    ORDER BY f.title COLLATE NOCASE ASC
  `).all() as Feed[];
}

export function getFeedById(id: number): Feed | undefined {
  return db.prepare('SELECT * FROM feeds WHERE id = ?').get(id) as Feed | undefined;
}

export function deleteFeed(id: number): void {
  db.prepare('DELETE FROM feeds WHERE id = ?').run(id);
}

export async function refreshFeed(id: number): Promise<Feed> {
  const feed = getFeedById(id);
  if (!feed) throw new Error('Feed not found');

  const { articles } = await parseFeed(feed.url);

  const insertArticle = db.prepare(
    'INSERT OR IGNORE INTO articles (feed_id, guid, title, link, summary, content, author, published_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
  );

  db.exec('BEGIN');
  try {
    for (const a of articles) {
      insertArticle.run(id, a.guid, a.title, a.link ?? null, a.summary ?? null, a.content ?? null, a.author ?? null, a.published_at ?? null);
    }
    db.exec('COMMIT');
  } catch (e) {
    db.exec('ROLLBACK');
    throw e;
  }

  db.prepare('UPDATE feeds SET last_fetched_at = ? WHERE id = ?').run(new Date().toISOString(), id);
  return getAllFeeds().find(f => f.id === id)!;
}
