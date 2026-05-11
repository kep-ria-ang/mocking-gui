import { useEffect } from 'react';

import { APITester } from '@/components/ui/APITester';
import { BASE_ENDPOINT } from '@/constants/api';
import { useUser } from '@/features/user/hooks/useUser';

export function UserProfile() {
  const { data, error, loading, status, headers, refetch } = useUser();

  useEffect(() => {
    refetch();
  }, [refetch]);

  return (
    <APITester
      title="User Profile API"
      description="Fetches user profile information. Try changing the mock variant in the Mocking GUI Panel."
      method="GET"
      url={`${BASE_ENDPOINT}/user/:username`}
      onRefetch={refetch}
      loading={loading}
      status={status}
      headers={headers}
      data={data}
      error={error}
    >
      <div className="text-sm text-blue-900">
        <h4 className="font-semibold mb-2">Instructions:</h4>
        <ol className="list-decimal list-inside space-y-1">
          <li>
            Open <strong>Mocking GUI Panel</strong> (bottom-left) &rarr; <strong>Mocks</strong> tab.
          </li>
          <li>
            Find <strong>User Profile</strong> handler.
          </li>
          <li>
            Select a <strong>Variant</strong> (e.g., <em>Success</em>, <em>Guest</em>,{' '}
            <em>Unauthorized</em>).
          </li>
          <li>
            Click <strong>Refetch</strong> to see the response change.
          </li>
        </ol>
      </div>
    </APITester>
  );
}
