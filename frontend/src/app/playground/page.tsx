'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser, logout, type User } from '@/lib/auth';

export default function Playground() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      router.push('/');
    } else {
      setUser(currentUser);
    }
  }, [router]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const getModeColor = (mode: string) => {
    switch (mode) {
      case 'normie':
        return 'bg-green-100 text-green-800';
      case 'explorer':
        return 'bg-blue-100 text-blue-800';
      case 'developer':
        return 'bg-purple-100 text-purple-800';
      case 'expert':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold">Amplifier</h1>
            </div>
            <div className="flex items-center gap-4">
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${getModeColor(
                  user.mode
                )}`}
              >
                {user.mode.charAt(0).toUpperCase() + user.mode.slice(1)} Mode
              </span>
              <div className="flex items-center gap-2">
                <img
                  src={user.avatar_url}
                  alt={user.name}
                  className="w-8 h-8 rounded-full"
                />
                <span className="text-sm font-medium">{user.name}</span>
              </div>
              <button
                onClick={logout}
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h2 className="text-4xl font-bold mb-4">Welcome to the Playground!</h2>
          <p className="text-xl text-gray-600 mb-8">
            Phase 0: Foundation - Authentication Complete
          </p>

          <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
            <div className="mb-6">
              <div className="text-6xl mb-4">🎉</div>
              <h3 className="text-2xl font-semibold mb-2">You're all set!</h3>
              <p className="text-gray-600">
                You've successfully authenticated with GitHub and selected{' '}
                <strong>{user.mode} mode</strong>.
              </p>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h4 className="font-semibold mb-4">What's Next?</h4>
              <ul className="text-left text-sm text-gray-600 space-y-2">
                <li>✅ Phase 0 Week 2: Core architecture complete</li>
                <li>🚧 Phase 1 Week 3: Gallery and execution engine</li>
                <li>🚧 Phase 1 Week 4: Polish and beta testing</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
