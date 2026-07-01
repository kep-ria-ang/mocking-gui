import { describe, it, expect } from 'vitest';
import { convertSwaggerToHandlers } from './convert';
import type { OpenAPI } from './convert';

describe('convertSwaggerToHandlers - Swagger Response Variants', () => {
  const baseUrl = 'http://localhost:3000/api';

  describe('Standard HTTP Status Codes', () => {
    it('should convert numeric status codes correctly', () => {
      const swagger: OpenAPI = {
        swagger: '2.0',
        info: { title: 'Test API', version: '1.0.0' },
        paths: {
          '/users': {
            get: {
              summary: 'Get users',
              responses: {
                '200': { description: 'Success', schema: { type: 'object' } },
                '400': { description: 'Bad Request', schema: { type: 'object' } },
                '500': { description: 'Server Error', schema: { type: 'object' } },
              },
            },
          },
        },
      };

      const handlers = convertSwaggerToHandlers(baseUrl, swagger);
      expect(handlers).toHaveLength(1);

      const variants = handlers[0].swaggerResponseVariants;
      expect(variants).toHaveLength(3);

      // Check status codes
      expect(variants[0].status).toBe(200);
      expect(variants[1].status).toBe(400);
      expect(variants[2].status).toBe(500);
    });
  });

  describe('Default Status Code (Bug #8)', () => {
    it('should handle "default" status code in responses', () => {
      const swagger: OpenAPI = {
        swagger: '2.0',
        info: { title: 'Test API', version: '1.0.0' },
        paths: {
          '/users': {
            get: {
              summary: 'Get users',
              responses: {
                '200': { description: 'Success', schema: { type: 'object' } },
                default: { description: 'Error', schema: { type: 'object' } },
              },
            },
          },
        },
      };

      const handlers = convertSwaggerToHandlers(baseUrl, swagger);
      expect(handlers).toHaveLength(1);

      const variants = handlers[0].swaggerResponseVariants;
      expect(variants).toHaveLength(2);

      // Check first variant (200)
      expect(variants[0].status).toBe(200);
      expect(variants[0].name).toBe('Success');

      // Check default variant - should NOT be NaN!
      expect(variants[1].status).not.toBe(NaN);
      expect(variants[1].name).toBe('Error');
      console.log('Default variant status:', variants[1].status);
    });

    it('should handle only "default" response', () => {
      const swagger: OpenAPI = {
        swagger: '2.0',
        info: { title: 'Test API', version: '1.0.0' },
        paths: {
          '/health': {
            get: {
              summary: 'Health check',
              responses: {
                default: { description: 'Health status', schema: { type: 'object' } },
              },
            },
          },
        },
      };

      const handlers = convertSwaggerToHandlers(baseUrl, swagger);
      expect(handlers).toHaveLength(1);

      const variants = handlers[0].swaggerResponseVariants;
      expect(variants).toHaveLength(1);
      expect(variants[0].status).not.toBe(NaN);
      expect(variants[0].name).toBe('Health status');
    });

    it('should prefer numeric codes over "default"', () => {
      const swagger: OpenAPI = {
        swagger: '2.0',
        info: { title: 'Test API', version: '1.0.0' },
        paths: {
          '/data': {
            post: {
              summary: 'Create data',
              responses: {
                '201': { description: 'Created', schema: { type: 'object' } },
                '400': { description: 'Bad Request', schema: { type: 'object' } },
                default: { description: 'Server Error', schema: { type: 'object' } },
              },
            },
          },
        },
      };

      const handlers = convertSwaggerToHandlers(baseUrl, swagger);
      const variants = handlers[0].swaggerResponseVariants;

      // Should have all three, with numeric codes as valid numbers
      expect(variants).toHaveLength(3);
      expect(variants[0].status).toBe(201);
      expect(variants[1].status).toBe(400);
      expect(variants[2].status).not.toBe(NaN);
    });
  });

  describe('OpenAPI 3.0 "default" Response', () => {
    it('should handle "default" in OpenAPI 3.0 spec', () => {
      const swagger: OpenAPI = {
        openapi: '3.0.0',
        info: { title: 'Test API', version: '1.0.0' },
        paths: {
          '/items': {
            get: {
              summary: 'List items',
              responses: {
                '200': {
                  description: 'Successful response',
                  content: {
                    'application/json': {
                      schema: { type: 'array' },
                    },
                  },
                },
                default: {
                  description: 'Error response',
                  content: {
                    'application/json': {
                      schema: { type: 'object', properties: { error: { type: 'string' } } },
                    },
                  },
                },
              },
            },
          },
        },
      };

      const handlers = convertSwaggerToHandlers(baseUrl, swagger);
      const variants = handlers[0].swaggerResponseVariants;

      expect(variants).toHaveLength(2);
      expect(variants[0].status).toBe(200);
      expect(variants[1].status).not.toBe(NaN);
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty responses', () => {
      const swagger: OpenAPI = {
        swagger: '2.0',
        info: { title: 'Test API', version: '1.0.0' },
        paths: {
          '/ping': {
            get: {
              summary: 'Ping',
              responses: {},
            },
          },
        },
      };

      const handlers = convertSwaggerToHandlers(baseUrl, swagger);
      expect(handlers).toHaveLength(1);
      expect(handlers[0].swaggerResponseVariants).toHaveLength(0);
    });

    it('should handle responses without schema', () => {
      const swagger: OpenAPI = {
        swagger: '2.0',
        info: { title: 'Test API', version: '1.0.0' },
        paths: {
          '/delete': {
            delete: {
              summary: 'Delete resource',
              responses: {
                '204': { description: 'No Content' },
              },
            },
          },
        },
      };

      const handlers = convertSwaggerToHandlers(baseUrl, swagger);
      const variants = handlers[0].swaggerResponseVariants;

      expect(variants).toHaveLength(1);
      expect(variants[0].status).toBe(204);
      expect(variants[0].body).toBeUndefined();
    });
  });
});
