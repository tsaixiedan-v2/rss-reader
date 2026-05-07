import { useState, useRef, useEffect } from 'react';

interface Props {
  onAdd: (url: string) => Promise<void>;
  onClose: () => void;
}

const SUGGESTIONS = [
  'https://feeds.arstechnica.com/arstechnica/index',
  'https://www.theverge.com/rss/index.xml',
  'https://hnrss.org/frontpage',
];

export default function AddFeedModal({ onAdd, onClose }: Props) {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { inputRef.current?.focus(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;
    setLoading(true);
    setError('');
    try {
      await onAdd(url.trim());
    } catch (err: any) {
      setError(err.message || 'Failed to add feed');
      setLoading(false);
    }
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 50, backdropFilter: 'blur(4px)',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: 'var(--bg-elevated)', border: '1px solid var(--border)',
          borderRadius: '12px', padding: '28px', width: '440px',
          boxShadow: '0 24px 48px rgba(0,0,0,0.6)',
        }}
      >
        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '20px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>
          Add RSS Feed
        </div>
        <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: '11px', color: 'var(--text-muted)', marginBottom: '20px' }}>
          Paste the URL of any RSS or Atom feed
        </div>

        <form onSubmit={handleSubmit}>
          <input
            ref={inputRef}
            type="url"
            value={url}
            onChange={e => setUrl(e.target.value)}
            placeholder="https://example.com/feed.xml"
            style={{
              width: '100%', padding: '10px 14px',
              background: 'var(--bg-input)', border: '1px solid var(--border)',
              borderRadius: '6px', color: 'var(--text-primary)',
              fontSize: '13px', fontFamily: "'IBM Plex Mono', monospace",
              outline: 'none', marginBottom: error ? '8px' : '16px', transition: 'border-color 0.15s',
            }}
            onFocus={e => { (e.target as HTMLElement).style.borderColor = 'rgba(212,146,10,0.5)'; }}
            onBlur={e => { (e.target as HTMLElement).style.borderColor = 'var(--border)'; }}
          />

          {error && (
            <div style={{
              fontSize: '12px', fontFamily: "'IBM Plex Mono', monospace",
              color: '#e05c5c', marginBottom: '16px', padding: '8px 12px',
              background: 'rgba(224,92,92,0.08)', borderRadius: '4px',
              border: '1px solid rgba(224,92,92,0.2)',
            }}>
              {error}
            </div>
          )}

          <div style={{ display: 'flex', gap: '8px' }}>
            <button type="submit" disabled={loading || !url.trim()} style={{
              flex: 1, padding: '10px',
              background: loading || !url.trim() ? 'var(--accent-muted)' : 'var(--accent)',
              border: 'none', borderRadius: '6px',
              color: loading || !url.trim() ? 'var(--accent)' : '#0f0d0b',
              cursor: loading || !url.trim() ? 'not-allowed' : 'pointer',
              fontSize: '13px', fontFamily: "'IBM Plex Mono', monospace",
              fontWeight: 500, transition: 'all 0.15s',
            }}>
              {loading ? 'Adding…' : 'Add Feed'}
            </button>
            <button type="button" onClick={onClose} style={{
              padding: '10px 16px', background: 'transparent',
              border: '1px solid var(--border)', borderRadius: '6px',
              color: 'var(--text-muted)', cursor: 'pointer',
              fontSize: '13px', fontFamily: "'IBM Plex Mono', monospace",
            }}>
              Cancel
            </button>
          </div>
        </form>

        <div style={{ marginTop: '20px' }}>
          <div style={{
            fontSize: '10px', fontFamily: "'IBM Plex Mono', monospace",
            color: 'var(--text-muted)', textTransform: 'uppercase',
            letterSpacing: '0.1em', marginBottom: '8px',
          }}>
            Try these
          </div>
          {SUGGESTIONS.map(s => (
            <button key={s} onClick={() => setUrl(s)} style={{
              display: 'block', width: '100%', textAlign: 'left',
              background: 'none', border: 'none', padding: '4px 0',
              color: 'var(--text-muted)', cursor: 'pointer',
              fontSize: '11px', fontFamily: "'IBM Plex Mono', monospace",
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              transition: 'color 0.1s',
            }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'var(--accent)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'var(--text-muted)'; }}
            >
              {s}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
