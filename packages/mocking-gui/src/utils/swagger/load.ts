import { convertSwaggerToHandlers } from './convert';

import type { OpenAPI } from './convert';
import type { HandlerState } from '@mocking-gui-types/handler';

/**
 * Fetches Swagger(OpenAPI) URL and converts it to HandlerState[]
 */
export const loadSwaggerHandlers = async (
  configUrl: string,
  serverUrl?: string,
): Promise<HandlerState[]> => {
  try {
    const res = await fetch(configUrl, { method: 'GET' });
    // Error handling (e.g., 403 Forbidden, 404 Not Found, etc.)
    if (!res.ok) {
      const statusText = res.statusText || 'Unknown Error';
      throw new Error(`HTTP ${res.status} ${statusText}`);
    }

    const baseUrl = serverUrl ?? new URL(configUrl).origin;
    const configJson = (await res.json()) as OpenAPI;
    return convertSwaggerToHandlers(baseUrl, configJson);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.warn(
      `[MockingGUI] Failed to load swagger handlers from ${configUrl}: ${message}`
    );
    throw err;
  }
};
