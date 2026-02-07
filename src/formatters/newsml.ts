import type { FeedConfig, GeneratedItem } from '../types';

export function formatNewsML(
  items: GeneratedItem[],
  config: FeedConfig,
  g2 = false
): string {
  const escapeXml = (str: string) =>
    str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');

  const formatDate = (date: Date, g2Style = false) =>
    g2Style ? date.toISOString() : date.toISOString().replace(/[-:]/g, '');

  if (g2) {
    // NewsML-G2 format
    const itemsXml = items
      .map((item, index) => {
        return `
    <newsItem guid="${escapeXml(item.guid)}" standard="NewsML-G2" standardversion="2.28">
      <catalogRef href="http://www.iptc.org/std/catalog/catalog.IPTC-G2-Standards_30.xml"/>
      <itemMeta>
        <itemClass qcode="ninat:text"/>
        <provider qcode="nprov:${escapeXml(config.title)}"/>
        <versionCreated>${formatDate(item.publishedAt, true)}</versionCreated>
        <pubStatus qcode="stat:usable"/>
      </itemMeta>
      <contentMeta>
        <urgency>3</urgency>
        <contentCreated>${formatDate(item.publishedAt, true)}</contentCreated>
        ${item.author ? `<creator><name>${escapeXml(item.author)}</name></creator>` : ''}
        ${item.categories.map((c) => `<subject type="cpnat:abstract"><name>${escapeXml(c)}</name></subject>`).join('\n        ')}
      </contentMeta>
      <contentSet>
        <inlineXML contenttype="application/xhtml+xml">
          <html xmlns="http://www.w3.org/1999/xhtml">
            <head><title>${escapeXml(item.title)}</title></head>
            <body>${item.content}</body>
          </html>
        </inlineXML>
        ${item.imageUrl ? `<remoteContent href="${escapeXml(item.imageUrl)}" contenttype="image/jpeg"/>` : ''}
      </contentSet>
    </newsItem>`;
      })
      .join('\n');

    return `<?xml version="1.0" encoding="UTF-8"?>
<newsMessage xmlns="http://iptc.org/std/nar/2006-10-01/">
  <header>
    <sent>${formatDate(new Date(), true)}</sent>
    <sender><name>${escapeXml(config.title)}</name></sender>
  </header>
  <itemSet>${itemsXml}
  </itemSet>
</newsMessage>`;
  }

  // NewsML 1.x format
  const itemsXml = items
    .map((item) => {
      return `
    <NewsItem>
      <Identification>
        <NewsIdentifier>
          <PublicIdentifier>${escapeXml(item.guid)}</PublicIdentifier>
          <NewsItemId>${escapeXml(item.guid)}</NewsItemId>
        </NewsIdentifier>
      </Identification>
      <NewsManagement>
        <NewsItemType FormalName="News"/>
        <FirstCreated>${formatDate(item.publishedAt)}</FirstCreated>
        <ThisRevisionCreated>${formatDate(item.lastModifiedAt)}</ThisRevisionCreated>
        <Status FormalName="Usable"/>
      </NewsManagement>
      <NewsComponent>
        <NewsLines>
          <HeadLine>${escapeXml(item.title)}</HeadLine>
          <DateLine>${escapeXml(item.summary || '')}</DateLine>
        </NewsLines>
        <AdministrativeMetadata>
          <Creator>
            <Party FormalName="${escapeXml(item.author || 'Unknown')}"/>
          </Creator>
        </AdministrativeMetadata>
        <DescriptiveMetadata>
          ${item.categories.map((c) => `<SubjectCode FormalName="${escapeXml(c)}"/>`).join('\n          ')}
          ${item.imageUrl ? `<Property FormalName="Photo" Value="${escapeXml(item.imageUrl)}"/>` : ''}
        </DescriptiveMetadata>
        <ContentItem Href="${escapeXml(item.link)}">
          <DataContent>${item.content}</DataContent>
        </ContentItem>
      </NewsComponent>
    </NewsItem>`;
    })
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<NewsML version="1.2">
  <Catalog Href="http://www.iptc.org/std/catalog/NewsML_1.2.xml"/>
  ${itemsXml}
</NewsML>`;
}