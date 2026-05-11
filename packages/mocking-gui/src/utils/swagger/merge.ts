import { getHandlerUniqueKey } from '@utils/common/keys';

import type { HandlerState } from '@mocking-gui-types/handler';

/**
 * Merges manual handlers and Swagger handlers based on keys.
 * - If the same key exists, only inject swaggerResponseVariants into the existing handler.
 * - If not, add the Swagger handler.
 * - Uses getHandlerUniqueKey as the default key generation function.
 */
export const mergeHandlersWithSwagger = (
  baseHandlers: HandlerState[],
  swaggerHandlers: HandlerState[],
): HandlerState[] => {
  const registerHandlerByKey = new Map<string, HandlerState>(
    baseHandlers.map(handler => [getHandlerUniqueKey(handler), handler]),
  );

  for (const handler of swaggerHandlers) {
    const key = getHandlerUniqueKey(handler);
    const existing = registerHandlerByKey.get(key);
    if (existing) {
      registerHandlerByKey.set(key, {
        ...existing,
        swaggerResponseVariants: handler.swaggerResponseVariants ?? handler.responseVariants,
      });
    } else {
      registerHandlerByKey.set(key, handler);
    }
  }

  return Array.from(registerHandlerByKey.values());
};
