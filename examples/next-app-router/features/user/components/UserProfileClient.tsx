'use client';

import { useCallback, useEffect, useState } from 'react';

import { APITester } from '@/components/ui/APITester';
import { fetchUserClient } from '@/features/user/api/client';

import type { ApiError, User } from '@/features/user/api/types';

export function UserProfileClient() {
  const [data, setData] = useState<User | null>(null);
  const [error, setError] = useState<ApiError | null>(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<number | null>(null);
  const [headers, setHeaders] = useState<Record<string, string> | undefined>(undefined);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    setStatus(null);

    try {
      const { data: userData, status: resStatus, headers: resHeaders } = await fetchUserClient();
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

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <APITester
      title="Client-Side Data (CSR)"
      description="Fetched in the browser via Service Worker interception."
      method="GET"
      url={`user/:username`}
      onRefetch={fetchData}
      loading={loading}
      status={status}
      headers={headers}
      data={data}
      error={error}
    >
      <div className="text-sm text-blue-900 dark:text-blue-200">
        <p>
          This data is fetched directly from the browser. Changes in Mocking GUI Panel are reflected
          instantly upon refetch.
        </p>
      </div>
    </APITester>
  );
}
