import type { FeedGenerator } from '../feed-generator';
import type { ConfigManager } from '../config';
import type { ContentSourceFormat, FeedConfig } from '../types';
import { formatFeed } from '../formatters';

export function createApiRoutes(
  generator: FeedGenerator,
  configManager: ConfigManager,
) {
  return {
    async handleFeed(
      request: Request,
      format: ContentSourceFormat,
    ): Promise<Response> {
      const url = new URL(request.url);
      const source = url.searchParams.get('source') || 'default';
      const items = generator.getItems(source);
      const config = configManager.getConfig();
      const content = formatFeed(items, config, format);

      const contentType =
        format === 'JSON' ? 'application/json' : 'application/xml';

      return new Response(content, {
        headers: {
          'Content-Type': `${contentType}; charset=utf-8`,
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Access-Control-Allow-Origin': '*',
        },
      });
    },

    async handleGetConfig(): Promise<Response> {
      return Response.json(configManager.getConfig());
    },

    async handleUpdateConfig(request: Request): Promise<Response> {
      try {
        const updates = (await request.json()) as Partial<FeedConfig>;
        configManager.updateConfig(updates);
        return Response.json({
          success: true,
          config: configManager.getConfig(),
        });
      } catch (error) {
        return Response.json(
          { error: error instanceof Error ? error.message : 'Unknown error' },
          { status: 400 },
        );
      }
    },

    async handleUpdateContentOptions(request: Request): Promise<Response> {
      try {
        const updates = (await request.json()) as Partial<
          FeedConfig['contentOptions']
        >;
        configManager.updateContentOptions(updates);
        return Response.json({ success: true });
      } catch (error) {
        return Response.json(
          { error: error instanceof Error ? error.message : 'Unknown error' },
          { status: 400 },
        );
      }
    },

    async handleUpdateFieldBehavior(request: Request): Promise<Response> {
      try {
        const updates = (await request.json()) as Partial<
          FeedConfig['fieldBehavior']
        >;
        configManager.updateFieldBehavior(updates);
        return Response.json({ success: true });
      } catch (error) {
        return Response.json(
          { error: error instanceof Error ? error.message : 'Unknown error' },
          { status: 400 },
        );
      }
    },

    async handleRegenerate(): Promise<Response> {
      generator.regenerate();
      return Response.json({ success: true, state: generator.getState() });
    },

    async handleGetState(): Promise<Response> {
      return Response.json(generator.getState());
    },

    async handleGetItems(): Promise<Response> {
      return Response.json(generator.getItems());
    },

    async handleResetConfig(): Promise<Response> {
      configManager.reset();
      return Response.json({ success: true });
    },

    async handleGetEndpoints(request: Request): Promise<Response> {
      const config = configManager.getConfig();
      const url = new URL(request.url);
      const baseUrl = `${url.protocol}//${url.host}`;
      const endpoints = config.endpoints.map((ep) => ({
        ...ep,
        url: `${baseUrl}${ep.path}`,
      }));
      return Response.json({ endpoints });
    },
  };
}
