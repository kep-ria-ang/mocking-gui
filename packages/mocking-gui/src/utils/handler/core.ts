import { HandlerType } from '@mocking-gui-types/handler';

import type { HandlerState, StoredHandlerVariants } from '@mocking-gui-types/handler';

/**
 * Checks if a specific type is possible based on the Handler structure
 */
const isHandlerTypeValid = (handler: HandlerState, type: HandlerType | null): boolean => {
  if (!type) return false;

  switch (type) {
    case HandlerType.MANUAL:
      return !!handler.responseVariants?.length;
    case HandlerType.AUTO:
      return !!handler.responseVariantsFn;
    case HandlerType.SWAGGER:
      return !!handler.swaggerResponseVariants?.length;
    default:
      return false;
  }
};

/**
 * Determines the Handler type based on the Handler structure
 * @returns HandlerType (MANUAL | AUTO | SWAGGER) or null (if neither exists)
 */
export const determineHandlerType = (
  handler: HandlerState,
  currentType?: HandlerType | null,
): HandlerType | null => {
  if (currentType && isHandlerTypeValid(handler, currentType)) return currentType;

  // Priority 1: Check responseVariants → MANUAL
  if (handler.responseVariants?.length) return HandlerType.MANUAL;

  // Priority 2: Check responseVariantsFn → AUTO
  if (handler.responseVariantsFn) return HandlerType.AUTO;

  // Priority 3: Check Swagger-based handler → SWAGGER
  if (handler.swaggerResponseVariants?.length) return HandlerType.SWAGGER;

  // Return null if neither exists
  return null;
};

/**
 * When there is no handler configuration stored in local storage
 * @example When it is a newly added handler / When localStorage is initialized
 * Returns the object used as the default value
 */
export const initialStoredHandlerVariants = (handler: HandlerState): StoredHandlerVariants => {
  const determinedType = determineHandlerType(handler);

  return {
    active: false,
    type: determinedType,
    variant:
      determinedType === HandlerType.MANUAL
        ? handler.responseVariants?.[0].name
        : determinedType === HandlerType.SWAGGER
          ? handler.swaggerResponseVariants?.[0].name
          : undefined, // Set default to the first variant for manual or swagger types
    delay: 0,
  };
};

/**
 * Validates and updates the config by comparing with the handler when a stored config exists
 * @returns Updated config or null (if handler is invalid)
 */
export const validateAndUpdateStoredConfig = (
  handler: HandlerState,
  storedConfigs: StoredHandlerVariants,
) => {
  const currentType = storedConfigs.type; // Stored type
  const determinedType = determineHandlerType(handler, currentType); // Type determined based on handler

  let updateConfig = { ...storedConfigs };

  /**
   * case 1: When the type has changed
   * Initialize according to type
   */
  if (currentType !== determinedType) {
    updateConfig = {
      ...storedConfigs,
      type: determinedType,
      variant:
        determinedType === HandlerType.MANUAL
          ? handler.responseVariants?.[0].name
          : determinedType === HandlerType.SWAGGER
            ? handler.swaggerResponseVariants?.[0].name
            : undefined, // Set default to the first variant for manual or swagger types
    };
  }

  /**
   * case 2: (ONLY MANUAL) Check if the selected variant is valid when type is MANUAL
   */
  if (updateConfig.type === HandlerType.MANUAL) {
    const isExistVariant = !!handler.responseVariants?.filter(
      variant => variant.name === updateConfig.variant,
    ).length;

    // If selected variant does not exist, set default to the first variant
    if (!isExistVariant) {
      updateConfig.variant = handler.responseVariants?.[0].name;
    }
  }

  /**
   * case 3: (ONLY SWAGGER) If type is SWAGGER, check if the selected variant is valid
   */
  if (updateConfig.type === HandlerType.SWAGGER) {
    const isExistVariant = !!handler.swaggerResponseVariants?.filter(
      variant => variant.name === updateConfig.variant,
    ).length;

    if (!isExistVariant) {
      updateConfig.variant = handler.swaggerResponseVariants?.[0].name;
    }
  }

  return updateConfig;
};
