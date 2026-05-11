import { HandlerType } from '@mocking-gui-types/handler';

import { COOKIE_KEY, getCookie } from '../browser/cookie';

import type { StoredHandlerVariants } from '@mocking-gui-types/handler';
/**
 * Reconstructs handler configurations from a sync cookie string.
 * Used for server-side state synchronization.
 */
export const reconstructHandlerConfigsFromCookie = (
  cookieString: string,
  baseConfigs: Record<string, StoredHandlerVariants> = {},
): Record<string, StoredHandlerVariants> => {
  const syncData = getCookie(cookieString, COOKIE_KEY);
  if (!syncData) return baseConfigs;

  const finalConfigs = { ...baseConfigs };

  try {
    const decodedData = decodeURIComponent(syncData);
    const parsedEntries: [string, string, string][] = JSON.parse(decodedData);

    parsedEntries.forEach(([key, typeChar, variant]) => {
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
    });
  } catch (e) {
    console.error('[MockingGUI] Failed to parse mocking_gui_sync cookie', e);
  }

  return finalConfigs;
};
