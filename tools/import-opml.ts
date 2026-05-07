import db from '../src/main/resources/config/database';
import { readFileSync } from 'node:fs';

const opmlPath = process.argv[2];
if (!opmlPath) {
  console.error('Usage: npx tsx tools/import-opml.ts <path-to-opml>');
  process.exit(1);
}

const decode = (s: string) =>
  s.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'");

const getFaviconUrl = (htmlUrl: string): string | null => {
  try {
    const { protocol, hostname } = new URL(htmlUrl);
    return `${protocol}//${hostname}/favicon.ico`;
  } catch { return null; }
};

const content = readFileSync(opmlPath, 'utf-8');
const insert = db.prepare('INSERT OR IGNORE INTO feeds (url, title, site_url, favicon_url) VALUES (?, ?, ?, ?)');

let inserted = 0;
let skipped = 0;

for (const line of content.split('\n')) {
  if (!line.includes('type="rss"')) continue;

  const xmlUrl = decode(line.match(/xmlUrl="([^"]+)"/)?.[1] ?? '');
  const title  = decode(line.match(/title="([^"]+)"/)?.[1] ?? line.match(/text="([^"]+)"/)?.[1] ?? '');
  const htmlUrl = decode(line.match(/htmlUrl="([^"]+)"/)?.[1] ?? '');

  if (!xmlUrl) continue;

  const result = insert.run(xmlUrl, title || xmlUrl, htmlUrl || null, getFaviconUrl(htmlUrl));
  if (result.changes > 0) {
    inserted++;
    process.stdout.write(`✓ ${title}\n`);
  } else {
    skipped++;
  }
}

console.log(`\n✅ ${inserted} feeds imported, ${skipped} already existed.`);
