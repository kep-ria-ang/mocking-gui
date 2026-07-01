import { HandlerType } from '@mocking-gui-types/handler'

import { COOKIE_KEY, getCookie } from '../browser/cookie'

import type { StoredHandlerVariants } from '@mocking-gui-types/handler'
/**
 * Retrieves multi-cookie value from cookie string.
 * Supports both single cookie (mocking_gui_sync) and split cookies (mocking_gui_sync_0, _1, etc.)
 *
 * @param cookieString - Raw cookie string from request header
 * @returns Concatenated value from all mocking_gui_sync_* cookies
 */
const getMultiCookieValue = (cookieString: string): string | null => {
  // Try single cookie (COOKIE_KEY) first for backward compatibility
  const singleValue = getCookie(cookieString, COOKIE_KEY);
  if (singleValue) {
    return singleValue;
  }

  // Then try multi-cookie format: mocking_gui_sync_0, _1, _2, ...
  let result = '';
  for (let index = 0; index < 100; index++) {
    const key = `${COOKIE_KEY}_${index}`;
    const value = getCookie(cookieString, key);
    if (!value) break;
    result += value;
  }

  return result.length > 0 ? result : null;
};

/**
 * Reconstructs handler configurations from sync cookies (single or multi-cookie).
 * Used for server-side state synchronization in SSR.
 *
 * @param cookieString - Raw cookie string from request header
 * @param baseConfigs - Default configurations if cookie not found
 * @returns Complete handler configurations with synced state applied
 */
export const reconstructHandlerConfigsFromCookie = (
  cookieString: string,
  baseConfigs: Record<string, StoredHandlerVariants> = {},
): Record<string, StoredHandlerVariants> => {
  const syncData = getMultiCookieValue(cookieString);
  if (!syncData) return baseConfigs;

  const finalConfigs = { ...baseConfigs };

  try {
    const decodedData = decodeURIComponent(syncData);
    const parsedEntries: [string, string, string][] = JSON.parse(decodedData);

    parsedEntries.forEach(([key, typeChar, variant]) => {
      if (!key || !typeChar) {
        console.warn('[MockingGUI] Invalid entry in sync cookie:', [key, typeChar, variant]);
        return;
      }

      const type =
        typeChar === 'M'
          ? HandlerType.MANUAL
          : typeChar === 'A'
            ? HandlerType.AUTO
            : HandlerType.SWAGGER;

      finalConfigs[key] = {
        active: true,
        type,
        variant: variant || undefined,
      };
    });

    console.log('[MockingGUI] Server-side state reconstructed from cookie', {
      count: parsedEntries.length,
      source: syncData.length > 3000 ? 'multi-cookie' : 'single-cookie',
    });
  } catch (error) {
    console.error(
      '[MockingGUI] Failed to parse mocking_gui_sync cookie. ' +
      'This may indicate a corrupted or malformed cookie. ' +
      'SSR will use default handler configurations.',
      error,
    );
    // Return baseConfigs on error (graceful fallback)
  }

  return finalConfigs;
};
