import type { Article } from '../types';

interface Props {
  article: Article | null;
}

function fullDate(dateStr?: string): string {
  if (!dateStr) return '';
  try {
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    });
  } catch { return ''; }
}

export default function ArticleReader({ article }: Props) {
  if (!article) {
    return (
      <div style={{
        flex: 1, height: '100vh', display: 'flex', alignItems: 'center',
        justifyContent: 'center', background: 'var(--bg-base)',
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '36px', marginBottom: '12px', opacity: 0.2 }}>◈</div>
          <div style={{
            fontFamily: "'IBM Plex Mono', monospace", fontSize: '12px',
            color: 'var(--text-muted)', letterSpacing: '0.05em',
          }}>
            Select an article to read
          </div>
        </div>
      </div>
    );
  }

  const content = article.content || article.summary;

  return (
    <div style={{ flex: 1, height: '100vh', overflowY: 'auto', background: 'var(--bg-base)' }}>
      <div style={{ maxWidth: '680px', margin: '0 auto', padding: '48px 40px 80px' }}>
        <div style={{
          display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px',
          marginBottom: '20px', fontFamily: "'IBM Plex Mono', monospace",
          fontSize: '11px', color: 'var(--text-muted)',
        }}>
          {article.feed_title && (
            <><span style={{ color: 'var(--accent)' }}>{article.feed_title}</span><span>·</span></>
          )}
          {article.published_at && <span>{fullDate(article.published_at)}</span>}
          {article.author && <><span>·</span><span>{article.author}</span></>}
        </div>

        <h1 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: 'clamp(24px, 3vw, 36px)', fontWeight: 700,
          color: 'var(--text-primary)', lineHeight: 1.25,
          marginBottom: '28px', letterSpacing: '-0.01em',
        }}>
          {article.title}
        </h1>

        <div style={{
          height: '1px',
          background: 'linear-gradient(to right, var(--accent), transparent)',
          marginBottom: '28px', opacity: 0.35,
        }} />

        {content ? (
          <div className="article-content" dangerouslySetInnerHTML={{ __html: content }} />
        ) : (
          <p style={{ fontFamily: "'Lora', serif", fontSize: '16px', color: 'var(--text-muted)', fontStyle: 'italic' }}>
            No content available.
          </p>
        )}

        {article.link && (
          <div style={{ marginTop: '40px', paddingTop: '24px', borderTop: '1px solid var(--border)' }}>
            <a
              href={article.link}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                fontFamily: "'IBM Plex Mono', monospace", fontSize: '12px',
                color: 'var(--accent)', textDecoration: 'none',
                border: '1px solid rgba(212,146,10,0.3)', borderRadius: '6px',
                padding: '8px 16px', transition: 'background 0.15s',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'var(--accent-muted)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
            >
              Open original article ↗
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
