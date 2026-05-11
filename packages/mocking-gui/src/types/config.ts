import { http, RequestHandler } from 'msw';

import type { HandlerResponseVariant, HttpResolverInfo } from './handler';
import type { StartOptions as WorkerStartOptions } from 'msw/browser';

// Client configuration type for Mocking GUI
export type MockingConfig = {
  mocks?: HandlerConfigOption[];
  swagger?: SwaggerSourceConfigOption[];
  worker?: WorkerStartOptions;
  /**
   * Additional MSW RequestHandlers that are not managed by Mocking GUI.
   * Useful for GraphQL or WebSocket handlers.
   */
  onDemandHandlers?: RequestHandler[];
};

export type MockingServerConfig = {
  /**
   * Cookie string passed from the browser (e.g., request.headers.get('cookie'))
   * Applies the browser GUI settings to the server when provided.
   */

  cookie?: string | null;
} & Omit<MockingConfig, 'method' | 'url' | 'name'>;

/** Handler Config Options */
export interface HandlerConfigOption {
  name: string;
  description?: string;
  url: string;
  method: keyof typeof http;
  /**
   * Function to statically change the response
   */
  responseVariants?: HandlerResponseVariant[];
  /**
   * Function to dynamically generate the response
   * - Can generate response using request parameters, headers, etc.
   */
  responseVariantsFn?: (info: HttpResolverInfo) => HandlerResponseVariant;
  delay?: number;
}

/** Swagger Config Options */
export interface SwaggerSourceConfigOption {
  /**
   * Defines the name for identifying the swagger source
   */
  name: string;
  /**
   * Endpoint URL for accessing Swagger/OpenAPI documentation (JSON)
   */
  configUrl: string;
  /**
   * Swagger UI web documentation URL provided by the service or other Docs
   * Supports link navigation in the API tab when provided
   */
  docsUrl?: string;
  /**
   * Specifies the server domain (URL) to be used for actual MSW API calls.
   * Instead of the server URL defined in Swagger config, specifies the target domain for MSW to intercept requests.
   */
  serverUrl?: string;
}
