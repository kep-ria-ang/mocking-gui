import { UserProfile } from './features/user/components/UserProfile';

function App() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-6 font-mono text-gray-800">
      <div className="w-full max-w-3xl">
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Mocking GUI Basic Example</h1>
          <p className="text-gray-600">
            Demonstrating Client-Side Rendering (CSR) with Mocking GUI.
          </p>
        </header>

        <main className="space-y-8">
          <UserProfile />
        </main>
      </div>
    </div>
  );
}

export default App;
