'use client';

import { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ChatWindow from '@/components/ChatWindow';

export default function Home() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-50 to-white">
      <Header onOpenChat={() => setIsChatOpen(true)} />
      <ChatWindow isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Applications as
              <br />
              Composable Intelligence Platforms
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 mb-8 max-w-4xl mx-auto">
              Amplifier changes how applications are built and extended in the AI era
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/overview"
                className="inline-flex items-center justify-center px-8 py-4 bg-blue-600 text-white text-lg font-medium rounded-lg hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl hover:scale-105"
              >
                Learn More
              </Link>
              <Link
                href="/examples/vs-code"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-blue-600 text-lg font-medium rounded-lg hover:bg-gray-50 transition-all border-2 border-blue-600"
              >
                See Examples
              </Link>
              <Link
                href="/playground"
                className="inline-flex items-center justify-center px-8 py-4 bg-purple-600 text-white text-lg font-medium rounded-lg hover:bg-purple-700 transition-all shadow-lg hover:shadow-xl hover:scale-105"
              >
                Try Playground
              </Link>
            </div>
          </div>
        </section>

        {/* The Transformation */}
        <section className="bg-white py-16 md:py-20 border-y border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900">
              The Transformation
            </h2>
            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {/* TODAY */}
              <div className="bg-gray-50 rounded-xl p-8 border-2 border-gray-300">
                <div className="text-sm font-semibold text-gray-500 mb-3 uppercase tracking-wide">Today</div>
                <h3 className="text-2xl font-bold mb-4 text-gray-900">Fixed Features</h3>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Apps ship with predetermined capabilities</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>One-size-fits-all AI features</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Vendor-provided intelligence</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Extensions require rebuild and redeploy</span>
                  </li>
                </ul>
              </div>

              {/* WITH AMPLIFIER */}
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-8 border-2 border-blue-300 relative">
                <div className="absolute -top-3 -right-3 bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-bold shadow-lg">
                  WITH AMPLIFIER
                </div>
                <div className="text-sm font-semibold text-blue-600 mb-3 uppercase tracking-wide">Tomorrow</div>
                <h3 className="text-2xl font-bold mb-4 text-gray-900">Composable Intelligence</h3>
                <ul className="space-y-3 text-gray-800 font-medium">
                  <li className="flex items-start">
                    <span className="mr-2">✓</span>
                    <span>Apps host modular AI building blocks</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">✓</span>
                    <span>Org-specific, context-aware intelligence</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">✓</span>
                    <span>Community-composed capabilities</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">✓</span>
                    <span>Load new bundles—no rebuild needed</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Examples */}
        <section className="py-16 md:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-gray-900">
              See It in Action
            </h2>
            <p className="text-center text-gray-600 mb-12 max-w-3xl mx-auto">
              Explore how Amplifier transforms applications into composable intelligence platforms
            </p>
            
            <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {/* VS Code */}
              <Link
                href="/examples/vs-code"
                className="bg-white rounded-xl p-6 border-2 border-gray-200 hover:border-blue-400 hover:shadow-xl transition-all group"
              >
                <div className="text-5xl mb-4">🖥️</div>
                <h3 className="text-xl font-bold mb-2 text-gray-900 group-hover:text-blue-600 transition-colors">
                  VS Code
                </h3>
                <p className="text-gray-600 mb-4">
                  From editor with AI to development intelligence platform running your org's bundles
                </p>
                <div className="text-blue-600 font-medium flex items-center">
                  See more →
                </div>
              </Link>

              {/* Excel */}
              <Link
                href="/examples/excel"
                className="bg-white rounded-xl p-6 border-2 border-gray-200 hover:border-green-400 hover:shadow-xl transition-all group"
              >
                <div className="text-5xl mb-4">📊</div>
                <h3 className="text-xl font-bold mb-2 text-gray-900 group-hover:text-green-600 transition-colors">
                  Excel
                </h3>
                <p className="text-gray-600 mb-4">
                  From spreadsheet with AI to domain analysis platform with industry-specific intelligence
                </p>
                <div className="text-green-600 font-medium flex items-center">
                  See more →
                </div>
              </Link>

              {/* Azure */}
              <Link
                href="/examples/azure"
                className="bg-white rounded-xl p-6 border-2 border-gray-200 hover:border-purple-400 hover:shadow-xl transition-all group"
              >
                <div className="text-5xl mb-4">☁️</div>
                <h3 className="text-xl font-bold mb-2 text-gray-900 group-hover:text-purple-600 transition-colors">
                  Azure
                </h3>
                <p className="text-gray-600 mb-4">
                  From cloud platform to infrastructure intelligence with compliance and cost optimization
                </p>
                <div className="text-purple-600 font-medium flex items-center">
                  See more →
                </div>
              </Link>
            </div>
          </div>
        </section>

        {/* Bottom CTAs */}
        <section className="bg-gradient-to-r from-blue-600 to-purple-600 py-16 md:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
              Ready to Learn More?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Explore the detailed overview, see all examples, or try it yourself
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/overview"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-blue-600 text-lg font-medium rounded-lg hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl hover:scale-105"
              >
                Detailed Overview
              </Link>
              <Link
                href="/examples/vs-code"
                className="inline-flex items-center justify-center px-8 py-4 bg-blue-700 text-white text-lg font-medium rounded-lg hover:bg-blue-800 transition-all border-2 border-white/20"
              >
                All Examples
              </Link>
              <Link
                href="/playground"
                className="inline-flex items-center justify-center px-8 py-4 bg-purple-700 text-white text-lg font-medium rounded-lg hover:bg-purple-800 transition-all border-2 border-white/20"
              >
                Try Playground
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
