import type { FeedConfig, GeneratedItem } from '../types';

export function formatNITF(items: GeneratedItem[], config: FeedConfig): string {
  const escapeXml = (str: string) =>
    str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');

  const formatDate = (date: Date) =>
    date.toISOString().replace(/[-:]/g, '').split('.')[0];

  const articlesXml = items
    .map((item) => {
      return `
<nitf version="3.6" change.date="${formatDate(item.lastModifiedAt)}" change.time="${formatDate(item.lastModifiedAt)}">
  <head>
    <title>${escapeXml(item.title)}</title>
    <meta name="article-headline" content="${escapeXml(item.title)}"/>
    <meta name="article-subheadline" content="${escapeXml(item.summary || '')}"/>
    <meta name="article-id" content="${escapeXml(item.guid)}"/>
    <meta name="article-pubdate" content="${formatDate(item.publishedAt)}"/>
    ${item.author ? `<meta name="byline" content="${escapeXml(item.author)}"/>` : ''}
    ${item.categories.map((c) => `<meta name="category" content="${escapeXml(c)}"/>`).join('\n    ')}
    <docdata>
      <doc-id id-string="${escapeXml(item.guid)}"/>
      <date.issue norm="${formatDate(item.publishedAt)}"/>
    </docdata>
  </head>
  <body>
    <body.head>
      <hedline>
        <hl1>${escapeXml(item.title)}</hl1>
      </hedline>
      ${item.author ? `<byline>${escapeXml(item.author)}</byline>` : ''}
      <dateline><story.date>${formatDate(item.publishedAt)}</story.date></dateline>
    </body.head>
    <body.content>
      ${item.imageUrl ? `<img src="${escapeXml(item.imageUrl)}"/>` : ''}
      ${item.content}
    </body.content>
    <body.end/>
  </body>
</nitf>`;
    })
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE nitf SYSTEM "http://www.nitf.org/nitf/3.6/nitf-3-6.dtd">
<nitf-doc>${articlesXml}
</nitf-doc>`;
}