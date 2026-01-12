'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ChatWindow from '@/components/ChatWindow';
import Link from 'next/link';

export default function ExamplesHub() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const examples = [
    {
      id: 'vs-code',
      name: 'VS Code',
      icon: '🖥️',
      category: 'Developer Tools',
      description: 'From editor to development intelligence platform',
      color: 'blue'
    },
    {
      id: 'excel',
      name: 'Excel',
      icon: '📊',
      category: 'Productivity',
      description: 'From spreadsheet to domain analysis platform',
      color: 'green'
    },
    {
      id: 'word',
      name: 'Word',
      icon: '📝',
      category: 'Productivity',
      description: 'From word processor to document intelligence platform',
      color: 'blue'
    },
    {
      id: 'azure',
      name: 'Azure',
      icon: '☁️',
      category: 'Cloud & Infrastructure',
      description: 'From cloud platform to infrastructure intelligence platform',
      color: 'purple'
    },
    {
      id: 'gaming',
      name: 'Gaming',
      icon: '🎮',
      category: 'Gaming',
      description: 'From fixed experience to personalized gaming intelligence',
      color: 'red'
    },
    {
      id: 'copilot-consumer',
      name: 'Copilot Consumer',
      icon: '🤖',
      category: 'Consumer AI',
      description: 'From AI assistant to personalized intelligence companion',
      color: 'purple'
    }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'border-blue-400 hover:border-blue-500 hover:shadow-blue-200',
      green: 'border-green-400 hover:border-green-500 hover:shadow-green-200',
      purple: 'border-purple-400 hover:border-purple-500 hover:shadow-purple-200',
      red: 'border-red-400 hover:border-red-500 hover:shadow-red-200',
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-white">
      <Header onOpenChat={() => setIsChatOpen(true)} />
      <ChatWindow isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />

      <main className="flex-1">
        {/* Hero */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Examples: How Amplifier Transforms Applications
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 mb-8 max-w-4xl mx-auto">
              See how Amplifier changes applications from fixed-feature products into composable intelligence platforms
            </p>
          </div>
        </section>

        {/* Examples Grid */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {examples.map((example) => (
              <Link
                key={example.id}
                href={`/examples/${example.id}`}
                className={`bg-white rounded-xl p-8 border-2 ${getColorClasses(example.color)} hover:shadow-xl transition-all group`}
              >
                <div className="text-6xl mb-4">{example.icon}</div>
                <div className="text-sm font-semibold text-gray-500 mb-2 uppercase tracking-wide">
                  {example.category}
                </div>
                <h3 className="text-2xl font-bold mb-3 text-gray-900 group-hover:text-blue-600 transition-colors">
                  {example.name}
                </h3>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  {example.description}
                </p>
                <div className="text-blue-600 font-medium flex items-center">
                  Explore transformation →
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="bg-gradient-to-r from-blue-600 to-purple-600 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold mb-4 text-white">
              Ready to Try It Yourself?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Test Amplifier bundles in our interactive playground
            </p>
            <Link
              href="/playground"
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-blue-600 text-lg font-medium rounded-lg hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl hover:scale-105"
            >
              Try Playground
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
