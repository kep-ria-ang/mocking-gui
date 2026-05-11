import { APITesterWithRefresh } from '@/components/ui/APITesterWithRefresh';
import { fetchUserServer } from '@/features/user/api/server';

export async function UserProfileServer() {
  const { data, error, status, headers } = await fetchUserServer();

  return (
    <APITesterWithRefresh
      title="Server-Side Data (RSC)"
      description="Fetched on the server. Mocking GUI uses cookies to sync mock state from the client."
      method="GET"
      url={`/user/:username`}
      status={status}
      headers={headers}
      data={data}
      error={error}
    >
      <div className="text-sm text-blue-900 dark:text-blue-200">
        <p>
          This data is fetched during server rendering (RSC). When you change the variant in the
          Mocking GUI Panel , the cookie is updated. Clicking <strong>Refetch</strong> will trigger
          a server re-render (<code>router.refresh()</code>).
        </p>
      </div>
    </APITesterWithRefresh>
  );
}
