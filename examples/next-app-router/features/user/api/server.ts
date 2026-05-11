import { BASE_ENDPOINT } from '@/constants/api';

import type { ApiError, User } from './types';

export const fetchUserServer = async (): Promise<{
  data: User | null;
  error: ApiError | null;
  status: number;
  headers: Record<string, string>;
}> => {
  try {
    const res = await fetch(`${BASE_ENDPOINT}/user/user1`, {
      cache: 'no-store', // Always fetch fresh data for SSR demo
    });

    const responseHeaders: Record<string, string> = {};
    res.headers.forEach((value, key) => {
      responseHeaders[key] = value;
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      return {
        data: null,
        error: {
          status: res.status,
          error: errorData?.error || `HTTP ${res.status}`,
        },
        status: res.status,
        headers: responseHeaders,
      };
    }

    const data = await res.json();
    return { data, error: null, status: res.status, headers: responseHeaders };
  } catch (err: unknown) {
    return {
      data: null,
      error: { error: String(err), status: 500 },
      status: 500,
      headers: {},
    };
  }
};
