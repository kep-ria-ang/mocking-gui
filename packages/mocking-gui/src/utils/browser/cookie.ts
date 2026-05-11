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
 */
let debounceTimer: ReturnType<typeof setTimeout> | null = null;

export const syncStateToCookie = (handlerConfigs: Record<string, StoredHandlerVariants>) => {
  if (typeof window === 'undefined') return;

  if (debounceTimer) clearTimeout(debounceTimer);

  debounceTimer = setTimeout(() => {
    const activeEntries = Object.entries(handlerConfigs)
      .filter(([_, config]) => config.active)
      .map(([key, config]) => {
        const typeChar = config.type?.[0] || 'M'; // Manual, Auto, Swagger
        return [key, typeChar, config.variant || ''];
      });

    const cookieValue = JSON.stringify(activeEntries);

    // Check cookie size limit (4KB)
    if (cookieValue.length > 3800) {
      console.warn(
        '[MockingGUI] Cookie sync size exceeded limit. Some mocks might not be synced to server.',
      );
      // If size exceeded, handle partial syncing or error
      // Currently just warning without truncation
    }

    setCookie(COOKIE_KEY, encodeURIComponent(cookieValue));
  }, 300);
};
