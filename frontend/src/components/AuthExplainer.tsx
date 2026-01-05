'use client';

import { useState } from 'react';

export default function AuthExplainer() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mt-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-sm text-blue-600 hover:text-blue-700 underline"
      >
        Why do I need to sign in?
      </button>

      {isOpen && (
        <div className="mt-3 p-4 bg-blue-50 rounded-lg text-sm text-gray-700 space-y-2">
          <p className="font-medium text-blue-900">
            We use GitHub OAuth to keep Amplifier free and fair for everyone:
          </p>
          <ul className="space-y-1 ml-4">
            <li>✅ <strong>Prevent abuse</strong> - Rate limit per user, not per IP</li>
            <li>✅ <strong>No signup needed</strong> - Just one-click authorization</li>
            <li>✅ <strong>Your data is yours</strong> - We don't store your work</li>
            <li>✅ <strong>Revoke anytime</strong> - In your GitHub settings</li>
          </ul>
          <p className="text-xs text-gray-600 pt-2 border-t border-blue-200">
            We only use your GitHub ID for rate limiting. No profiles, no tracking, no data collection.
          </p>
        </div>
      )}
    </div>
  );
}
