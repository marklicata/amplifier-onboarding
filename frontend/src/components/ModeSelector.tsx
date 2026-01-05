'use client';

import { useState } from 'react';
import { initiateGitHubLogin } from '@/lib/auth';
import AuthExplainer from './AuthExplainer';

type Mode = 'normie' | 'explorer' | 'developer' | 'expert';

interface ModeOption {
  id: Mode;
  icon: string;
  title: string;
  subtitle: string;
  description: string;
}

const modes: ModeOption[] = [
  {
    id: 'normie',
    icon: '🎯',
    title: 'Get things done',
    subtitle: 'Normie Mode',
    description: 'I want to use AI for specific tasks without coding',
  },
  {
    id: 'explorer',
    icon: '🔍',
    title: 'Explore and analyze',
    subtitle: 'Explorer Mode',
    description: 'I want to investigate and understand systems',
  },
  {
    id: 'developer',
    icon: '💻',
    title: 'Build and develop',
    subtitle: 'Developer Mode',
    description: "I'm a developer looking for AI assistance",
  },
  {
    id: 'expert',
    icon: '🚀',
    title: 'Customize and extend',
    subtitle: 'Expert Mode',
    description: 'I want full control and advanced capabilities',
  },
];

export default function ModeSelector() {
  const [selectedMode, setSelectedMode] = useState<Mode | null>(null);

  const handleContinue = () => {
    if (selectedMode) {
      initiateGitHubLogin(selectedMode);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2">What brings you to Amplifier?</h2>
        <p className="text-gray-600">
          Choose your experience level to get started
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {modes.map((mode) => (
          <button
            key={mode.id}
            onClick={() => setSelectedMode(mode.id)}
            className={`
              text-left p-6 rounded-lg border-2 transition-all
              ${
                selectedMode === mode.id
                  ? 'border-blue-500 bg-blue-50 shadow-lg'
                  : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
              }
            `}
          >
            <div className="flex items-start gap-4">
              <div className="text-4xl">{mode.icon}</div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-1">{mode.title}</h3>
                <p className="text-sm text-blue-600 font-medium mb-2">
                  {mode.subtitle}
                </p>
                <p className="text-sm text-gray-600">{mode.description}</p>
              </div>
            </div>
          </button>
        ))}
      </div>

      <div className="text-center">
        <button
          onClick={handleContinue}
          disabled={!selectedMode}
          className={`
            px-8 py-3 rounded-lg font-medium text-white transition-colors
            ${
              selectedMode
                ? 'bg-blue-600 hover:bg-blue-700 shadow-lg'
                : 'bg-gray-300 cursor-not-allowed'
            }
          `}
        >
          Continue with GitHub
        </button>
        <p className="text-sm text-gray-500 mt-3">
          Free • No signup • One-click authorization
        </p>
        <AuthExplainer />
      </div>
    </div>
  );
}
