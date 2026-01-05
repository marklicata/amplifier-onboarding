'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated } from '@/lib/auth';
import ModeSelector from '@/components/ModeSelector';

export default function Home() {
  const router = useRouter();
  const [showModeSelector, setShowModeSelector] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    // Check if user is already authenticated
    if (isAuthenticated()) {
      router.push('/playground');
    } else {
      setIsCheckingAuth(false);
    }
  }, [router]);

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (showModeSelector) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-8">
        <ModeSelector />
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="text-center max-w-4xl">
        <h1 className="text-6xl font-bold mb-4">Amplifier</h1>
        <p className="text-2xl text-gray-700 mb-8">
          Program Intelligence, Not Just Code
        </p>
        <p className="text-lg text-gray-600 mb-8">
          Transform how you build with AI through composable, modular,
          declarative workflows
        </p>

        {/* Value Props */}
        <div className="grid grid-cols-3 gap-4 mb-12 text-sm">
          <div className="p-4 bg-green-50 rounded-lg">
            <div className="text-2xl mb-2">🌍</div>
            <div className="font-semibold">Free & Open</div>
            <div className="text-gray-600">No payment required</div>
          </div>
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl mb-2">⚡</div>
            <div className="font-semibold">Instant Start</div>
            <div className="text-gray-600">No signup, just GitHub</div>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl mb-2">🔒</div>
            <div className="font-semibold">Privacy First</div>
            <div className="text-gray-600">No data stored</div>
          </div>
        </div>

        <div className="mb-12">
          <button
            onClick={() => setShowModeSelector(true)}
            className="px-8 py-4 bg-blue-600 text-white text-lg font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-lg"
          >
            Try the Playground →
          </button>
          <p className="text-sm text-gray-500 mt-3">
            Open to everyone • Rate limited for fair use
          </p>
        </div>

        <div className="text-sm text-gray-500 border-t border-gray-200 pt-8">
          <p>Phase 0: Foundation ✓</p>
          <p className="mt-2">
            Pre-warmed sessions • GitHub OAuth • JWT • Rate limiting • Analytics
          </p>
        </div>
      </div>
    </main>
  );
}
