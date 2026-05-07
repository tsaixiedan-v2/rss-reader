import { useState, useEffect, useCallback } from 'react';
import type { Feed, Article } from './types';
import { api } from './api';
import Sidebar from './components/Sidebar';
import ArticleList from './components/ArticleList';
import ArticleReader from './components/ArticleReader';
import AddFeedModal from './components/AddFeedModal';

export default function App() {
  const [feeds, setFeeds] = useState<Feed[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [selectedFeed, setSelectedFeed] = useState<Feed | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [loadingArticles, setLoadingArticles] = useState(false);

  const loadFeeds = useCallback(async () => {
    setFeeds(await api.getFeeds());
  }, []);

  const loadArticles = useCallback(async (feedId?: number) => {
    setLoadingArticles(true);
    setArticles(await api.getArticles(feedId));
    setLoadingArticles(false);
  }, []);

  useEffect(() => {
    loadFeeds();
    loadArticles();
  }, [loadFeeds, loadArticles]);

  const handleSelectFeed = useCallback((feed: Feed | null) => {
    setSelectedFeed(feed);
    setSelectedArticle(null);
    loadArticles(feed?.id);
  }, [loadArticles]);

  const handleSelectArticle = useCallback(async (article: Article) => {
    setSelectedArticle(article);
    if (!article.is_read) {
      await api.markAsRead(article.id);
      setArticles(prev => prev.map(a => a.id === article.id ? { ...a, is_read: true } : a));
      setFeeds(prev => prev.map(f =>
        f.id === article.feed_id ? { ...f, unread_count: Math.max(0, (f.unread_count || 0) - 1) } : f
      ));
    }
  }, []);

  const handleAddFeed = useCallback(async (url: string) => {
    const feed = await api.addFeed(url);
    setFeeds(prev => [...prev, feed].sort((a, b) => a.title.localeCompare(b.title)));
    setShowAddModal(false);
  }, []);

  const handleDeleteFeed = useCallback(async (feed: Feed) => {
    await api.deleteFeed(feed.id);
    setFeeds(prev => prev.filter(f => f.id !== feed.id));
    if (selectedFeed?.id === feed.id) {
      setSelectedFeed(null);
      loadArticles();
    }
  }, [selectedFeed, loadArticles]);

  const handleRefreshFeed = useCallback(async (feed: Feed) => {
    await api.refreshFeed(feed.id);
    await loadFeeds();
    await loadArticles(selectedFeed?.id);
  }, [selectedFeed, loadFeeds, loadArticles]);

  const handleMarkAllRead = useCallback(async () => {
    if (!selectedFeed) return;
    await api.markFeedAsRead(selectedFeed.id);
    setArticles(prev => prev.map(a => ({ ...a, is_read: true })));
    setFeeds(prev => prev.map(f => f.id === selectedFeed.id ? { ...f, unread_count: 0 } : f));
  }, [selectedFeed]);

  return (
    <div style={{ display: 'flex', height: '100vh', background: 'var(--bg-base)' }}>
      <Sidebar
        feeds={feeds}
        selectedFeed={selectedFeed}
        onSelectFeed={handleSelectFeed}
        onDeleteFeed={handleDeleteFeed}
        onRefreshFeed={handleRefreshFeed}
        onAddFeed={() => setShowAddModal(true)}
      />
      <ArticleList
        articles={articles}
        selectedArticle={selectedArticle}
        selectedFeed={selectedFeed}
        loading={loadingArticles}
        onSelectArticle={handleSelectArticle}
        onMarkAllRead={handleMarkAllRead}
      />
      <ArticleReader article={selectedArticle} />
      {showAddModal && (
        <AddFeedModal onAdd={handleAddFeed} onClose={() => setShowAddModal(false)} />
      )}
    </div>
  );
}
