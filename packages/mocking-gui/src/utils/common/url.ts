/**
 * Extract baseURL from URL
 * - Return url if it is a relative path
 */

type ExtractedBaseUrl = {
  origin: string;
  pathname: string;
};

export const extractBaseUrl = (url: string): ExtractedBaseUrl => {
  try {
    const urlObj = new URL(url);

    return {
      origin: urlObj.origin,
      pathname: urlObj.pathname,
    };
  } catch {
    // Return as is if it's a relative path
    return {
      origin: 'API List',
      pathname: url,
    };
  }
};
