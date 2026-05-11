import { http } from 'msw';

import { normalizePathParams } from '../handler/pathParams';

import type { HandlerState } from '@mocking-gui-types/handler';

type OpenAPIResponse = {
  description?: string;
};

type OpenAPIOperation = {
  summary?: string;
  tags?: string[];
  operationId?: string;
  responses?: Record<string, OpenAPIResponse>;
};

type OpenAPIPaths = Record<string, Partial<Record<string, OpenAPIOperation>>>;

export type OpenAPI = {
  openapi?: string;
  info?: unknown;
  servers?: Array<{ url: string; description?: string }>;
  paths: OpenAPIPaths;
};

/**
 * Utility to convert Swagger(OpenAPI) JSON to HandlerState[]
 */
export const convertSwaggerToHandlers = (baseUrl: string, swagger: OpenAPI): HandlerState[] => {
  const methodKeys = Object.keys(http) as (keyof typeof http)[];
  const handlers: HandlerState[] = [];

  Object.entries(swagger.paths ?? {}).forEach(([path, operations]) => {
    methodKeys.forEach(method => {
      const operation = (operations ?? {})[method];
      if (!operation) return;

      const name = operation.summary || operation.operationId || `${method.toUpperCase()} ${path}`;
      const responses = operation.responses ?? {};
      const handlerPath = baseUrl + normalizePathParams(path);

      const swaggerResponseVariants =
        Object.entries(responses).map(([statusCode, res]) => {
          const name = res?.description || statusCode;
          return {
            name,
            status: Number(statusCode),
          };
        }) || [];

      const handler: HandlerState = {
        name,
        method,
        url: handlerPath,
        swaggerResponseVariants,
      };
      handlers.push(handler);
    });
  });

  return handlers;
};
