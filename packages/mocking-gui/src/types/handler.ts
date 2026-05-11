import { DelayMode, JsonBodyType, PathParams } from 'msw';

import { HandlerConfigOption } from './config';

/**
 * Handler configuration values stored in local storage
 */

export enum HandlerType {
  MANUAL = 'Manual',
  AUTO = 'Auto',
  SWAGGER = 'Swagger',
}

export type StoredHandlerVariants = {
  active: boolean;
  type: HandlerType | null; // null when there are no reponseVariant and reponseVariantFn
  variant?: string; // variant name when response type is manual
  delay?: number | DelayMode;
};

/**
 * Handler type passed to the user
 */
export type RawBody =
  | { kind: 'text'; value: string }
  | { kind: 'html'; value: string }
  | { kind: 'binary'; value: Uint8Array | ArrayBuffer }
  | { kind: 'xml'; value: string }
  | { kind: 'arrayBuffer'; value: ArrayBuffer | SharedArrayBuffer }
  | { kind: 'formData'; value: FormData };

export interface HandlerResponseVariant {
  name: string;
  status: number;
  headers?: HeadersInit;
  body?: JsonBodyType;
  rawBody?: RawBody;
}

export type HttpResolverInfo = {
  params: PathParams;
  request: Request;
  cookies?: Record<string, string>;
};

export interface HandlerState extends HandlerConfigOption {
  /**
   * Response variants generated based on Swagger(OpenAPI)
   */
  swaggerResponseVariants?: HandlerResponseVariant[];
}

export enum ScenarioMatchStatus {
  ACTIVE = 'Active',
  INACTIVE = 'Inactive',
}

export type Scenario = {
  id: string;
  name: string;
  description?: string;
  /** Map of handler keys and their configuration values (focused on active handlers) */
  configs: Record<string, StoredHandlerVariants>;
  createdAt: string;
};
