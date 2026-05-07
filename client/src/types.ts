export interface Feed {
  id: number;
  url: string;
  title: string;
  description?: string;
  site_url?: string;
  favicon_url?: string;
  last_fetched_at?: string;
  created_at: string;
  unread_count?: number;
}

export interface Article {
  id: number;
  feed_id: number;
  feed_title?: string;
  guid: string;
  title: string;
  link?: string;
  summary?: string;
  content?: string;
  author?: string;
  published_at?: string;
  is_read: boolean;
  created_at: string;
}
