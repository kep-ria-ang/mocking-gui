import type { HandlerState } from '@mocking-gui-types/handler';

export const convertHandlersForExport = (handlers: HandlerState[]): HandlerState[] => {
  return handlers.map(({ swaggerResponseVariants, ...rest }) => ({
    ...rest,
    responseVariants: swaggerResponseVariants ?? rest.responseVariants,
  }));
};
