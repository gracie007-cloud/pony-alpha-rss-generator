import type { FeedConfig, GeneratedItem } from '../types';

export function formatGenericXml(
  items: GeneratedItem[],
  config: FeedConfig,
): string {
  const escapeXml = (str: string) =>
    str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');

  const itemsXml = items
    .map((item) => {
      return `
  <item>
    <id>${escapeXml(item.guid)}</id>
    <title>${escapeXml(item.title)}</title>
    <link>${escapeXml(item.link)}</link>
    <description>${escapeXml(item.summary)}</description>
    <content>${escapeXml(item.content)}</content>
    ${item.author ? `<author>${escapeXml(item.author)}</author>` : ''}
    <published>${item.publishedAt.toISOString()}</published>
    ${item.lastModifiedAt ? `<updated>${item.lastModifiedAt.toISOString()}</updated>` : ''}
    ${item.imageUrl ? `<image><url>${escapeXml(item.imageUrl)}</url></image>` : ''}
    ${item.categories.map((c) => `<category>${escapeXml(c)}</category>`).join('\n    ')}
  </item>`;
    })
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<feed>
  <title>${escapeXml(config.title)}</title>
  <description>${escapeXml(config.description)}</description>
  <link>${escapeXml(config.link)}</link>
  ${itemsXml}
</feed>`;
}
