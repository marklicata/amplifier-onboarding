'use client';

import Link from 'next/link';

interface HeaderProps {
  onOpenChat?: () => void;
}

export default function Header({ onOpenChat }: HeaderProps) {
  return (
    <header className="border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/elevator-pitch">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent cursor-pointer">
              Amplifier
            </h1>
          </Link>
          <nav className="hidden md:flex space-x-8">
            <Link
              href="/elevator-pitch"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Elevator Pitch
            </Link>
            <button
              onClick={onOpenChat}
              className="text-gray-600 hover:text-gray-900 transition-colors"
              title="Ask Amplifier anything!"
            >
              Got Questions?
            </button>
            <Link
              href="/playground"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Playground
            </Link>
            <Link
              href="/system-overview"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              System Overview
            </Link>
          </nav>
          <button className="md:hidden text-blue-600 hover:text-blue-700 font-medium">
            Menu
          </button>
        </div>
      </div>
    </header>
  );
}
