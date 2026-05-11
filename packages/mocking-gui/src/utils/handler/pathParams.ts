/**
 * Normalize dynamic parameters in Swagger/OpenAPI path to MSW style
 * - "{id}" -> ":id"
 */
export const normalizePathParams = (path: string) => {
  if (!path) return path;
  return path.replace(/\{([^}]+)\}/g, ':$1');
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
