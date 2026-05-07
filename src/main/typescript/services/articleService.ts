import db from '../../resources/config/database';
import type { Article } from '../models/types';

const mapArticle = (raw: any): Article => ({ ...raw, is_read: Boolean(raw.is_read) });

export function getArticlesByFeed(feedId: number, limit = 50, offset = 0): Article[] {
  return (db.prepare(`
    SELECT a.*, f.title as feed_title
    FROM articles a JOIN feeds f ON f.id = a.feed_id
    WHERE a.feed_id = ?
    ORDER BY a.published_at DESC, a.created_at DESC
    LIMIT ? OFFSET ?
  `).all(feedId, limit, offset) as any[]).map(mapArticle);
}

export function getAllArticles(limit = 50, offset = 0): Article[] {
  return (db.prepare(`
    SELECT a.*, f.title as feed_title
    FROM articles a JOIN feeds f ON f.id = a.feed_id
    ORDER BY a.published_at DESC, a.created_at DESC
    LIMIT ? OFFSET ?
  `).all(limit, offset) as any[]).map(mapArticle);
}

export function markAsRead(id: number): void {
  db.prepare('UPDATE articles SET is_read = 1 WHERE id = ?').run(id);
}

export function markFeedAsRead(feedId: number): void {
  db.prepare('UPDATE articles SET is_read = 1 WHERE feed_id = ?').run(feedId);
}
