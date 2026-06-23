import { sample } from 'openapi-sampler';

import { normalizePathParams } from '../handler/pathParams';

import type { HandlerState } from '@mocking-gui-types/handler';
import type { http, JsonBodyType } from 'msw';

type OpenAPISchema = Record<string, unknown>;

type OpenAPIMediaType = {
  schema?: OpenAPISchema;
};

type OpenAPIResponse = {
  description?: string;
  content?: Record<string, OpenAPIMediaType>;
  headers?: Record<string, unknown>;
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
  swagger?: string;
  info?: unknown;
  servers?: Array<{ url: string; description?: string }>;
  paths: OpenAPIPaths;
  components?: {
    schemas?: Record<string, OpenAPISchema>;
    responses?: Record<string, unknown>;
  };
  definitions?: Record<string, OpenAPISchema>;
};

const generateMockFromSchema = (schema: OpenAPISchema, specs: OpenAPI): unknown => {
  if (!schema || typeof schema !== 'object') return null;

  try {
    return sample(schema, {}, specs);
  } catch (error) {
    console.warn(
      '[MockingGUI] Failed to generate mock:',
      error instanceof Error ? error.message : String(error),
    );
    return null;
  }
};

export const convertSwaggerToHandlers = (baseUrl: string, swagger: OpenAPI): HandlerState[] => {
  const handlers: HandlerState[] = [];

  Object.entries(swagger.paths ?? {}).forEach(([path, operations]) => {
    Object.entries(operations ?? {}).forEach(([method, operation]) => {
      if (!operation) return;

      const httpMethod = method as keyof typeof http;

      const name = operation.summary || operation.operationId || `${method.toUpperCase()} ${path}`;
      const responses = operation.responses ?? {};
      const handlerPath = baseUrl + normalizePathParams(path);

      const swaggerResponseVariants = Object.entries(responses).map(([statusCode, res]) => {
        const variantName = res?.description || statusCode;

        let body: JsonBodyType | undefined;
        const schema = res?.content?.['application/json']?.schema ?? res?.content?.['*/*']?.schema;

        if (schema && typeof schema === 'object') {
          body = generateMockFromSchema(schema as OpenAPISchema, swagger) as JsonBodyType;
        }

        return {
          name: variantName,
          status: Number(statusCode),
          body,
        };
      });

      const handler: HandlerState = {
        name,
        method: httpMethod,
        url: handlerPath,
        swaggerResponseVariants,
      };
      handlers.push(handler);
    });
  });

  return handlers;
};
