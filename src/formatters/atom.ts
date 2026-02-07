import type { FeedConfig, GeneratedItem } from '../types';

export function formatAtom(items: GeneratedItem[], config: FeedConfig): string {
  const escapeXml = (str: string) =>
    str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');

  const formatDate = (date: Date) => date.toISOString();

  const entriesXml = items
    .map((item) => {
      let xml = '<entry>';

      xml += `<id>${escapeXml(item.guid)}</id>`;
      xml += `<title>${escapeXml(item.title)}</title>`;

      if (item.link) {
        xml += `<link href="${escapeXml(item.link)}"/>`;
      }

      if (item.summary) {
        xml += `<summary>${escapeXml(item.summary)}</summary>`;
      }

      if (item.content) {
        xml += `<content type="html"><![CDATA[${item.content}]]></content>`;
      }

      if (item.author) {
        xml += `<author><name>${escapeXml(item.author)}</name></author>`;
      }

      if (item.publishedAt) {
        xml += `<published>${formatDate(item.publishedAt)}</published>`;
      }

      if (item.lastModifiedAt) {
        xml += `<updated>${formatDate(item.lastModifiedAt)}</updated>`;
      }

      if (item.imageUrl) {
        xml += `<link rel="enclosure" href="${escapeXml(item.imageUrl)}" type="image/jpeg"/>`;
      }

      for (const cat of item.categories) {
        xml += `<category term="${escapeXml(cat)}"/>`;
      }

      xml += '</entry>';
      return xml;
    })
    .join('\n    ');

  return `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <id>${config.link}/feed/atom</id>
  <title>${escapeXml(config.title)}</title>
  <subtitle>${escapeXml(config.description)}</subtitle>
  <link href="${config.link}/feed/atom" rel="self"/>
  <link href="${config.link}"/>
  <updated>${formatDate(new Date())}</updated>
  ${entriesXml}
</feed>`;
}