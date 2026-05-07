import type { Article, Feed } from '../types';

interface Props {
  articles: Article[];
  selectedArticle: Article | null;
  selectedFeed: Feed | null;
  loading: boolean;
  onSelectArticle: (article: Article) => void;
  onMarkAllRead: () => void;
}

function timeAgo(dateStr?: string): string {
  if (!dateStr) return '';
  try {
    const diff = Date.now() - new Date(dateStr).getTime();
    const m = Math.floor(diff / 60000);
    if (m < 60) return `${m}m ago`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h ago`;
    const d = Math.floor(h / 24);
    if (d < 7) return `${d}d ago`;
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  } catch { return ''; }
}

export default function ArticleList({ articles, selectedArticle, selectedFeed, loading, onSelectArticle, onMarkAllRead }: Props) {
  const unreadCount = articles.filter(a => !a.is_read).length;

  return (
    <div style={{
      width: '320px', minWidth: '320px', height: '100vh',
      background: 'var(--bg-elevated)', borderRight: '1px solid var(--border)',
      display: 'flex', flexDirection: 'column',
    }}>
      <div style={{ padding: '16px 16px 12px', borderBottom: '1px solid var(--border)', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
          <h2 style={{
            fontFamily: "'Playfair Display', serif", fontSize: '18px', fontWeight: 600,
            color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          }}>
            {selectedFeed ? selectedFeed.title : 'All Articles'}
          </h2>
          {unreadCount > 0 && (
            <button onClick={onMarkAllRead} style={{
              background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer',
              fontSize: '11px', fontFamily: "'IBM Plex Mono', monospace",
              whiteSpace: 'nowrap', padding: '2px 0', flexShrink: 0, marginLeft: '8px',
            }}>
              Mark all read
            </button>
          )}
        </div>
        <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '11px', color: 'var(--text-muted)' }}>
          {loading ? 'Loading…' : `${articles.length} articles · ${unreadCount} unread`}
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto' }}>
        {!loading && articles.length === 0 && (
          <div style={{ padding: '24px 16px', color: 'var(--text-muted)', fontFamily: "'IBM Plex Mono', monospace", fontSize: '12px', lineHeight: 1.7 }}>
            No articles yet.{!selectedFeed && <><br />Add a feed to get started.</>}
          </div>
        )}

        {articles.map(article => {
          const isSelected = selectedArticle?.id === article.id;
          return (
            <div
              key={article.id}
              onClick={() => onSelectArticle(article)}
              style={{
                padding: '14px 16px', borderBottom: '1px solid var(--border-subtle)',
                cursor: 'pointer', transition: 'background 0.1s',
                background: isSelected ? 'rgba(212,146,10,0.07)' : 'transparent',
                borderLeft: !article.is_read ? '2px solid var(--accent)' : '2px solid transparent',
              }}
              onMouseEnter={e => { if (!isSelected) (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.02)'; }}
              onMouseLeave={e => { if (!isSelected) (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
            >
              <div style={{
                fontSize: '14px', fontFamily: "'Libre Franklin', sans-serif",
                fontWeight: article.is_read ? 400 : 600,
                color: article.is_read ? 'var(--text-secondary)' : 'var(--text-primary)',
                lineHeight: 1.4, marginBottom: '6px',
                display: '-webkit-box', WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical' as const, overflow: 'hidden',
              }}>
                {article.title}
              </div>
              <div style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                fontSize: '11px', fontFamily: "'IBM Plex Mono', monospace", color: 'var(--text-muted)',
              }}>
                {!selectedFeed && article.feed_title && (
                  <><span style={{ color: 'var(--accent)', opacity: 0.8 }}>{article.feed_title}</span><span>·</span></>
                )}
                <span>{timeAgo(article.published_at)}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
