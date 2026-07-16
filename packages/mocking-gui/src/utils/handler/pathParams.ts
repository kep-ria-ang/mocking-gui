/**
 * Sanitizes an OpenAPI param name into a path-to-regexp-safe identifier.
 * `path-to-regexp` (used internally by MSW) reads a named param token only
 * up to the first non-word character, so e.g. "kubeflow-id" would silently
 * compile to param "kubeflow" + literal "-id", which never matches a real
 * request. Non-alphanumeric runs are camelCased away instead.
 */
const toSafeParamName = (name: string) =>
  name.replace(/[^a-zA-Z0-9_]+([a-zA-Z0-9])/g, (_, char: string) => char.toUpperCase());

/**
 * Normalize dynamic parameters in Swagger/OpenAPI path to MSW style
 * - "{id}" -> ":id"
 * - "{kubeflow-id}" -> ":kubeflowId"
 */
export const normalizePathParams = (path: string) => {
  if (!path) return path;
  return path.replace(/\{([^}]+)\}/g, (_, name: string) => `:${toSafeParamName(name)}`);
};

/**
 * Mask dynamic segments (:something) in path based on index
 * e.g.: /v1/:a/:b/users → /v1/:param1/:param2/users
 */
export const maskDynamicSegmentsIndexed = (path: string) => {
  if (!path) return path;
  let index = 1;
  const masked = path
    .split('/')
    .map(seg => (seg.startsWith(':') ? `:param${index++}` : seg))
    .join('/');
  // Clean up duplicate slashes
  return masked.replace(/\/{2,}/g, '/');
};

/**
 * Returns a key string combining normalized path from full URL string
 * - Performs only path normalization on original string if it fails
 */
export const generateNormalizedUrl = (url: string) => {
  try {
    const urlObj = new URL(url);
    const normalizedPath = maskDynamicSegmentsIndexed(normalizePathParams(urlObj.pathname));
    return `${urlObj.origin}${normalizedPath}`;
  } catch {
    return maskDynamicSegmentsIndexed(normalizePathParams(url));
  }
};
