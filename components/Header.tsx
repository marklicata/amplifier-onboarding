'use client';

import Link from 'next/link';
import { useState } from 'react';
import { trackEvent } from '@/lib/telemetry';

interface HeaderProps {
  onOpenChat?: () => void;
}

export default function Header({ onOpenChat }: HeaderProps) {
  const [isExamplesOpen, setIsExamplesOpen] = useState(false);

  const handleExamplesOpen = () => {
    setIsExamplesOpen(true);
    try {
      trackEvent('header_dropdown_opened', { dropdown: 'examples' });
    } catch (error) {
      console.error('Failed to track dropdown opened:', error);
    }
  };

  const handleExamplesClose = () => {
    setIsExamplesOpen(false);
    try {
      trackEvent('header_dropdown_closed', { dropdown: 'examples' });
    } catch (error) {
      console.error('Failed to track dropdown closed:', error);
    }
  };

  return (
    <header className="border-b border-gray-200 bg-white backdrop-blur-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" data-track-label="Header - Home Link">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent cursor-pointer">
              Amplifier
            </h1>
          </Link>
          <nav className="hidden md:flex space-x-8 items-center" data-track-context="header-navigation">
            <Link
              href="/"
              className="text-gray-600 hover:text-gray-900 transition-colors"
              data-track-label="Header - Home Link"
            >
              Home
            </Link>
            <Link
              href="/overview"
              className="text-gray-600 hover:text-gray-900 transition-colors"
              data-track-label="Header - Overview Link"
            >
              Overview
            </Link>
            
            {/* Examples Dropdown */}
            <div 
              className="relative"
              onMouseEnter={handleExamplesOpen}
              onMouseLeave={handleExamplesClose}
            >
              <button
                className="text-gray-600 hover:text-gray-900 transition-colors flex items-center gap-1"
                data-track-label="Header - Examples Dropdown"
              >
                Examples
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {isExamplesOpen && (
                <div className="absolute top-full left-0 mt-0 pt-2 w-64">
                  <div className="bg-white rounded-lg shadow-xl border border-gray-200 py-2" data-track-context="examples-dropdown">
                  {/* Developer Tools */}
                  <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Developer Tools
                  </div>
                  <Link
                    href="/examples/vs-code"
                    className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                    data-track-label="Header Dropdown - VS Code"
                  >
                    <span className="mr-2">🖥️</span>VS Code
                  </Link>
                  
                  {/* Productivity */}
                  <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider mt-2">
                    Productivity
                  </div>
                  <Link
                    href="/examples/excel"
                    className="block px-4 py-2 text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors"
                    data-track-label="Header Dropdown - Excel"
                  >
                    <span className="mr-2">📊</span>Excel
                  </Link>
                  <Link
                    href="/examples/word"
                    className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                    data-track-label="Header Dropdown - Word"
                  >
                    <span className="mr-2">📝</span>Word
                  </Link>
                  
                  {/* Cloud & Infrastructure */}
                  <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider mt-2">
                    Cloud & Infrastructure
                  </div>
                  <Link
                    href="/examples/azure"
                    className="block px-4 py-2 text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors"
                    data-track-label="Header Dropdown - Azure"
                  >
                    <span className="mr-2">☁️</span>Azure
                  </Link>
                  
                  {/* Gaming */}
                  <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider mt-2">
                    Gaming
                  </div>
                  <Link
                    href="/examples/gaming"
                    className="block px-4 py-2 text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
                    data-track-label="Header Dropdown - Xbox/Players"
                  >
                    <span className="mr-2">🎮</span>Xbox/Players
                  </Link>
                  
                  {/* Consumer AI */}
                  <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider mt-2">
                    Consumer AI
                  </div>
                  <Link
                    href="/examples/copilot-consumer"
                    className="block px-4 py-2 text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors"
                    data-track-label="Header Dropdown - Copilot Consumer"
                  >
                    <span className="mr-2">🤖</span>Copilot Consumer
                  </Link>
                  </div>
                </div>
              )}
            </div>

            <Link
              href="/system-overview"
              className="text-gray-600 hover:text-gray-900 transition-colors"
              data-track-label="Header - How It Works Link"
            >
              How It Works
            </Link>
            <Link
              href="/playground"
              className="text-gray-600 hover:text-gray-900 transition-colors"
              data-track-label="Header - Playground Link"
            >
              Playground
            </Link>
            <button
              onClick={onOpenChat}
              className="text-gray-600 hover:text-gray-900 transition-colors"
              title="Ask Amplifier anything!"
              data-track-label="Header - Questions Button"
            >
              Questions
            </button>
          </nav>
          <button className="md:hidden text-blue-600 hover:text-blue-700 font-medium">
            Menu
          </button>
        </div>
      </div>
    </header>
  );
}

