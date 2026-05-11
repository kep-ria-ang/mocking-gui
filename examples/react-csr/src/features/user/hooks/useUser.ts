import { useCallback, useState } from 'react';

import { fetchUser } from '@/features/user/api/user';

import type { ApiError, User } from '@/features/user/api/types';

interface UseUserResult {
  data: User | null;
  error: ApiError | null;
  loading: boolean;
  status: number | null;
  headers: Record<string, string> | undefined;
  refetch: () => Promise<void>;
}

export function useUser(): UseUserResult {
  const [data, setData] = useState<User | null>(null);
  const [error, setError] = useState<ApiError | null>(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<number | null>(null);
  const [headers, setHeaders] = useState<Record<string, string> | undefined>(undefined);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    setStatus(null); // Reset status on new fetch

    try {
      const { data: userData, status: resStatus, headers: resHeaders } = await fetchUser();
      setData(userData);
      setStatus(resStatus);
      setHeaders(resHeaders);
    } catch (err: unknown) {
      const apiError = err as ApiError;
      setError(apiError);

      const status = typeof apiError.status === 'number' ? apiError.status : 500;
      setStatus(status);
      setData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, error, loading, status, headers, refetch };
}
