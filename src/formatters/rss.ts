import type { FeedConfig, GeneratedItem } from '../types';

export function formatRSS(
  items: GeneratedItem[],
  config: FeedConfig,
  version: '0.91' | '0.92' | '2.0' = '2.0',
): string {
  const escapeXml = (str: string) =>
    str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');

  const formatDate = (date: Date) => date.toUTCString();

  const itemsXml = items
    .map((item) => {
      let xml = '<item>';

      if (item.title) {
        xml += `<title>${escapeXml(item.title)}</title>`;
      }

      if (item.link) {
        xml += `<link>${escapeXml(item.link)}</link>`;
      }

      if (item.summary) {
        xml += `<description>${escapeXml(item.summary)}</description>`;
      }

      if (item.content && version === '2.0') {
        xml += `<content:encoded><![CDATA[${item.content}]]></content:encoded>`;
      }

      if (item.author) {
        xml += `<author>${escapeXml(item.author)}</author>`;
      }

      if (item.categories.length > 0) {
        for (const cat of item.categories) {
          xml += `<category>${escapeXml(cat)}</category>`;
        }
      }

      if (item.guid) {
        xml += `<guid isPermaLink="false">${escapeXml(item.guid)}</guid>`;
      }

      if (item.publishedAt) {
        xml += `<pubDate>${formatDate(item.publishedAt)}</pubDate>`;
      }

      if (item.imageUrl) {
        xml += `<enclosure url="${escapeXml(item.imageUrl)}" type="image/jpeg" length="0"/>`;
      }

      xml += '</item>';
      return xml;
    })
    .join('\n    ');

  const versionAttrs =
    version === '2.0'
      ? 'version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/"'
      : version === '0.92'
        ? 'version="0.92"'
        : 'version="0.91"';

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss ${versionAttrs}>
  <channel>
    <title>${escapeXml(config.title)}</title>
    <description>${escapeXml(config.description)}</description>
    <link>${escapeXml(config.link)}</link>
    <language>${config.language}</language>
    <lastBuildDate>${formatDate(new Date())}</lastBuildDate>
    ${itemsXml}
  </channel>
</rss>`;
}
