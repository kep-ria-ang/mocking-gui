import { BASE_ENDPOINT } from '@/constants/api';

import type { ApiError, User } from './types';

export const fetchUserClient = async (): Promise<{
  data: User;
  status: number;
  headers: Record<string, string>;
}> => {
  const res = await fetch(`${BASE_ENDPOINT}/user/user1`, {
    headers: { 'Content-Type': 'application/json' },
  });

  const responseHeaders: Record<string, string> = {};
  res.headers.forEach((value, key) => {
    responseHeaders[key] = value;
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw {
      status: res.status,
      error: errorData?.error || `HTTP ${res.status}`,
      headers: responseHeaders,
    } as ApiError;
  }

  const data = (await res.json()) as User;
  return { data, status: res.status, headers: responseHeaders };
};
