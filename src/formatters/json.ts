import type { FeedConfig, GeneratedItem } from '../types';

export function formatJsonFeed(
  items: GeneratedItem[],
  config: FeedConfig
): string {
  const feed = {
    version: 'https://jsonfeed.org/version/1.1',
    title: config.title,
    description: config.description,
    home_page_url: config.link,
    feed_url: `${config.link}/feed/json`,
    language: config.language,
    items: items.map((item) => ({
      id: item.guid,
      url: item.link,
      title: item.title,
      summary: item.summary || undefined,
      content_html: item.content || undefined,
      image: item.imageUrl || undefined,
      authors: item.author ? [{ name: item.author }] : undefined,
      date_published: item.publishedAt.toISOString(),
      date_modified: item.lastModifiedAt?.toISOString(),
      tags: item.categories.length > 0 ? item.categories : undefined,
      attachments:
        item.extractedMedia.length > 0
          ? item.extractedMedia.map((m) => ({
              url: m.originalUrl,
              mime_type: m.originalMimeType,
            }))
          : undefined,
    })),
  };

  return JSON.stringify(feed, null, 2);
}