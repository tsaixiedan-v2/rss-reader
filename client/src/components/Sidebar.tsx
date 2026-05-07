import { useState } from 'react';
import type { Feed } from '../types';

interface Props {
  feeds: Feed[];
  selectedFeed: Feed | null;
  onSelectFeed: (feed: Feed | null) => void;
  onDeleteFeed: (feed: Feed) => void;
  onRefreshFeed: (feed: Feed) => void;
  onAddFeed: () => void;
}

const S: Record<string, React.CSSProperties> = {
  root: {
    width: '240px', minWidth: '240px', height: '100vh',
    background: 'var(--bg-panel)', borderRight: '1px solid var(--border)',
    display: 'flex', flexDirection: 'column', overflow: 'hidden',
  },
  logo: {
    padding: '20px 16px 16px', borderBottom: '1px solid var(--border-subtle)',
    fontFamily: "'IBM Plex Mono', monospace", fontSize: '13px', fontWeight: 500,
    color: 'var(--accent)', letterSpacing: '0.08em', textTransform: 'uppercase' as const,
  },
  sectionLabel: {
    padding: '14px 18px 6px',
    fontSize: '10px', fontFamily: "'IBM Plex Mono', monospace",
    color: 'var(--text-muted)', letterSpacing: '0.12em', textTransform: 'uppercase' as const,
  },
  feedList: { flex: 1, overflowY: 'auto' as const, padding: '0 8px 8px' },
  addBtn: {
    width: '100%', padding: '9px',
    background: 'var(--accent-muted)', border: '1px solid rgba(212,146,10,0.2)',
    borderRadius: '6px', color: 'var(--accent)', cursor: 'pointer',
    fontSize: '12px', fontFamily: "'IBM Plex Mono', monospace",
    letterSpacing: '0.05em', transition: 'background 0.15s',
  },
};

export default function Sidebar({ feeds, selectedFeed, onSelectFeed, onDeleteFeed, onRefreshFeed, onAddFeed }: Props) {
  const [hoveredId, setHoveredId] = useState<number | 'all' | null>(null);
  const [busyId, setBusyId] = useState<number | null>(null);
  const totalUnread = feeds.reduce((sum, f) => sum + (f.unread_count || 0), 0);

  const handleDelete = async (e: React.MouseEvent, feed: Feed) => {
    e.stopPropagation();
    setBusyId(feed.id);
    await onDeleteFeed(feed);
    setBusyId(null);
  };

  const handleRefresh = async (e: React.MouseEvent, feed: Feed) => {
    e.stopPropagation();
    setBusyId(feed.id);
    await onRefreshFeed(feed);
    setBusyId(null);
  };

  const isAllSelected = selectedFeed === null;

  return (
    <aside style={S.root}>
      <div style={S.logo}>◈ RSS Reader</div>

      <div style={{ padding: '8px 8px 0' }}>
        <button
          onClick={() => onSelectFeed(null)}
          onMouseEnter={() => setHoveredId('all')}
          onMouseLeave={() => setHoveredId(null)}
          style={{
            width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '8px 10px', borderRadius: '6px', border: 'none', cursor: 'pointer',
            background: isAllSelected ? 'var(--accent-muted)' : hoveredId === 'all' ? 'rgba(255,255,255,0.03)' : 'transparent',
            color: isAllSelected ? 'var(--accent)' : 'var(--text-secondary)',
            borderLeft: isAllSelected ? '2px solid var(--accent)' : '2px solid transparent',
            fontSize: '13px', fontFamily: "'IBM Plex Mono', monospace",
            transition: 'all 0.1s', textAlign: 'left',
          }}
        >
          <span>All Articles</span>
          {totalUnread > 0 && (
            <span style={{
              fontSize: '11px', color: 'var(--accent)', background: 'var(--accent-muted)',
              padding: '1px 6px', borderRadius: '10px', fontFamily: "'IBM Plex Mono', monospace",
            }}>{totalUnread}</span>
          )}
        </button>
      </div>

      <div style={S.sectionLabel}>Feeds</div>

      <div style={S.feedList}>
        {feeds.length === 0 && (
          <div style={{ padding: '10px 10px', fontSize: '12px', color: 'var(--text-muted)', fontFamily: "'IBM Plex Mono', monospace", lineHeight: 1.6 }}>
            No feeds yet.<br />Add one below.
          </div>
        )}
        {feeds.map(feed => {
          const isSelected = selectedFeed?.id === feed.id;
          const isHovered = hoveredId === feed.id;
          return (
            <div
              key={feed.id}
              onClick={() => onSelectFeed(feed)}
              onMouseEnter={() => setHoveredId(feed.id)}
              onMouseLeave={() => setHoveredId(null)}
              style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                padding: '8px 10px', borderRadius: '6px', cursor: 'pointer', marginBottom: '1px',
                background: isSelected ? 'var(--accent-muted)' : isHovered ? 'rgba(255,255,255,0.03)' : 'transparent',
                borderLeft: isSelected ? '2px solid var(--accent)' : '2px solid transparent',
                transition: 'all 0.1s',
              }}
            >
              <div style={{ flexShrink: 0, width: '16px', height: '16px' }}>
                {feed.favicon_url ? (
                  <img src={feed.favicon_url} alt="" style={{ width: '16px', height: '16px', borderRadius: '3px' }}
                    onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                ) : (
                  <div style={{
                    width: '16px', height: '16px', borderRadius: '3px',
                    background: 'var(--bg-elevated)', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', fontSize: '8px', color: 'var(--text-muted)',
                  }}>◈</div>
                )}
              </div>

              <span style={{
                flex: 1, fontSize: '13px', fontFamily: "'Libre Franklin', sans-serif",
                color: isSelected ? 'var(--text-primary)' : 'var(--text-secondary)',
                fontWeight: feed.unread_count ? 500 : 400,
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
              }}>
                {feed.title}
              </span>

              {isHovered ? (
                <div style={{ display: 'flex', gap: '2px', flexShrink: 0 }}>
                  {[
                    { label: '↻', action: handleRefresh, title: 'Refresh' },
                    { label: '✕', action: handleDelete, title: 'Remove' },
                  ].map(({ label, action, title }) => (
                    <button key={title} onClick={e => action(e, feed)} disabled={busyId === feed.id} title={title}
                      style={{
                        background: 'none', border: 'none', cursor: 'pointer',
                        color: 'var(--text-muted)', fontSize: '12px', padding: '2px 5px',
                        borderRadius: '3px', lineHeight: 1,
                      }}>
                      {label}
                    </button>
                  ))}
                </div>
              ) : feed.unread_count ? (
                <span style={{
                  fontSize: '10px', fontFamily: "'IBM Plex Mono', monospace",
                  color: 'var(--accent)', background: 'var(--accent-muted)',
                  padding: '1px 5px', borderRadius: '8px', flexShrink: 0,
                }}>{feed.unread_count}</span>
              ) : null}
            </div>
          );
        })}
      </div>

      <div style={{ padding: '8px', borderTop: '1px solid var(--border-subtle)' }}>
        <button onClick={onAddFeed} style={S.addBtn}>+ Add Feed</button>
      </div>
    </aside>
  );
}
