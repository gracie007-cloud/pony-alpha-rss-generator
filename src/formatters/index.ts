import type { FeedConfig, GeneratedItem, ContentSourceFormat } from '../types';
import { formatRSS } from './rss';
import { formatAtom } from './atom';
import { formatJsonFeed } from './json';
import { formatNewsML } from './newsml';
import { formatNITF } from './nitf';
import { formatGenericXml } from './xml';

export function formatFeed(
  items: GeneratedItem[],
  config: FeedConfig,
  format: ContentSourceFormat,
): string {
  switch (format) {
    case 'RSS':
      return formatRSS(items, config, '2.0');
    case 'RSS_091':
      return formatRSS(items, config, '0.91');
    case 'RSS_092':
      return formatRSS(items, config, '0.92');
    case 'ATOM':
      return formatAtom(items, config);
    case 'JSON':
      return formatJsonFeed(items, config);
    case 'XML':
      return formatGenericXml(items, config);
    case 'NEWSML':
      return formatNewsML(items, config, false);
    case 'NEWSML_G2':
      return formatNewsML(items, config, true);
    case 'NITF':
      return formatNITF(items, config);
    default:
      return formatRSS(items, config, '2.0');
  }
}

export {
  formatRSS,
  formatAtom,
  formatJsonFeed,
  formatNewsML,
  formatNITF,
  formatGenericXml,
};
