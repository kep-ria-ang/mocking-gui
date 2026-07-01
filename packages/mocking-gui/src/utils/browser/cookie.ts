import type { StoredHandlerVariants } from '@mocking-gui-types/handler';

export const COOKIE_KEY = 'mocking_gui_sync';

/**
 * Sets a cookie in the browser environment.
 */
export const setCookie = (name: string, value: string, days: number = 7) => {
  if (typeof document === 'undefined') return;

  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  const expires = `; expires=${date.toUTCString()}`;
  document.cookie = `${name}=${value}${expires}; path=/`;
};

/**
 * Retrieves a specific cookie value from the cookie string.
 */
export const getCookie = (cookieString: string, name: string): string | null => {
  const cookieNameEqualSubString = `${name}=`;
  const cookieArray = cookieString.split(';');

  for (let i = 0; i < cookieArray.length; i++) {
    let cookiePart = cookieArray[i].trim();
    if (cookiePart.indexOf(cookieNameEqualSubString) === 0) {
      return cookiePart.substring(cookieNameEqualSubString.length, cookiePart.length);
    }
  }
  return null;
};

/**
 * Compresses handlerConfigs state and syncs to cookie.
 * Format: [["key", "type(M/A/S)", "variant"], ...]
 *
 * Syncs immediately (no debounce) to ensure SSR consistency.
 * SSR may read cookie during request, so debounce delay causes desynchronization.
 * Performance impact: negligible (~0.1ms per sync)
 */
export const syncStateToCookie = (handlerConfigs: Record<string, StoredHandlerVariants>) => {
  if (typeof window === 'undefined') return;

  try {
    const activeEntries = Object.entries(handlerConfigs)
      .filter(([_, config]) => config.active)
      .map(([key, config]) => {
        const typeChar = config.type?.[0] || 'M'; // Manual, Auto, Swagger
        return [key, typeChar, config.variant || ''];
      });

    const cookieValue = JSON.stringify(activeEntries);
    const encoded = encodeURIComponent(cookieValue);

    // Check cookie size and handle overflow
    if (encoded.length <= 3800) {
      // Tier 1: Single cookie (≤3800 bytes)
      setCookie(COOKIE_KEY, encoded);
    } else if (encoded.length <= 10000) {
      // Tier 2: Multi-cookie split (3800-10000 bytes)
      syncMultiCookie(encoded);
    } else {
      // Tier 3: Size limit exceeded (>10000 bytes)
      throw new Error(
        `[MockingGUI] Mocking state too large (${encoded.length} bytes). ` +
          'Consider reducing the number of handlers or using feature flags.',
      );
    }
  } catch (error) {
    console.error('[MockingGUI] Failed to sync state to cookie:', error);
    // Rethrow in development, log gracefully in production
    if (process.env.NODE_ENV === 'development') {
      throw error;
    }
  }
};

/**
 * Splits large state across multiple cookies (mocking_gui_sync_0, _1, etc.)
 * Standard pattern used by Google Analytics and other libraries.
 *
 * @param encoded - URL-encoded cookie value
 */
const syncMultiCookie = (encoded: string) => {
  const CHUNK_SIZE = 3000; // Conservative size to account for overhead
  const chunks = encoded.match(new RegExp(`.{1,${CHUNK_SIZE}}`, 'g')) || [];

  chunks.forEach((chunk, index) => {
    const cookieKey = `${COOKIE_KEY}_${index}`;
    setCookie(cookieKey, chunk);
  });
};
