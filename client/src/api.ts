import type { Feed, Article } from './types';

const API = 'http://localhost:3001/api';

export const api = {
  async getFeeds(): Promise<Feed[]> {
    const res = await fetch(`${API}/feeds`);
    return res.json();
  },

  async addFeed(url: string): Promise<Feed> {
    const res = await fetch(`${API}/feeds`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url }),
    });
    if (!res.ok) throw new Error((await res.json()).error);
    return res.json();
  },

  async deleteFeed(id: number): Promise<void> {
    await fetch(`${API}/feeds/${id}`, { method: 'DELETE' });
  },

  async refreshFeed(id: number): Promise<Feed> {
    const res = await fetch(`${API}/feeds/${id}/refresh`, { method: 'POST' });
    if (!res.ok) throw new Error((await res.json()).error);
    return res.json();
  },

  async getArticles(feedId?: number): Promise<Article[]> {
    const url = feedId ? `${API}/articles?feedId=${feedId}` : `${API}/articles`;
    const res = await fetch(url);
    return res.json();
  },

  async markAsRead(articleId: number): Promise<void> {
    await fetch(`${API}/articles/${articleId}/read`, { method: 'PATCH' });
  },

  async markFeedAsRead(feedId: number): Promise<void> {
    await fetch(`${API}/articles/feed/${feedId}/read-all`, { method: 'PATCH' });
  },
};
