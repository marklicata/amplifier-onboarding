'use client';

import { useState, useEffect, useRef } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ChatWindow from '@/components/ChatWindow';

export default function ElevatorPitch() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const warmupInitiated = useRef(false);

  // Warm up the Amplifier session on page load
  useEffect(() => {
    // Prevent double-call in React Strict Mode
    if (warmupInitiated.current) {
      return;
    }
    warmupInitiated.current = true;

    const warmupSession = async () => {
      try {
        console.log('Warming up Amplifier chat session...');
        await fetch('/api/chat/warmup', {
          method: 'POST',
        });
        console.log('Amplifier session warmup complete');
      } catch (error) {
        // Silently fail - warmup is optional optimization
        console.warn('Session warmup failed:', error);
      }
    };

    warmupSession();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-50 to-white">
      <Header onOpenChat={() => setIsChatOpen(true)} />
      <ChatWindow isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
          <div className="text-center">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Program Intelligence,
              <br />
              Not Just Code
            </h2>
            <p className="text-xl md:text-2xl text-gray-700 mb-4 max-w-3xl mx-auto font-medium">
              Transform AI from "better autocomplete" to composable middleware for building intelligent applications.
            </p>
            <p className="text-lg text-gray-600 mb-8 max-w-3xl mx-auto">
              Amplifier enables developers to build through declarative, modular, and composable AI workflows.
              Define what you want—not how to get it—and watch AI orchestrate the work.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                className="inline-flex items-center justify-center px-8 py-4 bg-blue-600 text-white text-lg font-medium rounded-lg hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl hover:scale-105"
              >
                Try It Now →
              </button>
              <a
                href="#vision"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-blue-600 text-lg font-medium rounded-lg hover:bg-gray-50 transition-all border-2 border-blue-600"
              >
                Learn More
              </a>
            </div>
          </div>
        </section>

        {/* Vision Section */}
        <section id="vision" className="bg-white py-12 md:py-20 border-y border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <h3 className="text-3xl md:text-4xl font-bold text-center mb-8">Our Vision</h3>
              <div className="grid md:grid-cols-2 gap-8 mb-12">
                <div className="text-center p-6">
                  <div className="text-sm font-semibold text-gray-500 mb-3">TODAY</div>
                  <p className="text-gray-600 leading-relaxed">
                    Developers chat with AI, copy-paste code, and repeat themselves.
                    AI is treated as "better autocomplete" instead of the transformative force it can be.
                  </p>
                </div>
                <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl">
                  <div className="text-sm font-semibold text-blue-600 mb-3">TOMORROW</div>
                  <p className="text-gray-800 leading-relaxed font-medium">
                    Anyone declares what they want, AI orchestrates the work,
                    and results are reproducible, shareable, and composable.
                  </p>
                </div>
              </div>
              <p className="text-center text-xl text-gray-700 font-semibold">
                Amplifier is the bridge to that future.
              </p>
            </div>
          </div>
        </section>

        {/* Core Value Props */}
        <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
          <h3 className="text-3xl md:text-4xl font-bold text-center mb-4">Core Value Propositions</h3>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Amplifier fundamentally changes how developers build intelligent applications
          </p>
          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="text-4xl mb-4">🎯</div>
              <h4 className="text-xl font-semibold mb-2">Declarative by Design</h4>
              <p className="text-gray-600">
                Define what you want, not how to get it. Amplifier orchestrates multi-agent workflows automatically.
                Focus on outcomes, not implementation details.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="text-4xl mb-4">🔧</div>
              <h4 className="text-xl font-semibold mb-2">Composable & Modular</h4>
              <p className="text-gray-600">
                Build with reusable bundles, recipes, and skills. Mix and match components to create powerful,
                maintainable workflows. Share and remix community creations.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="text-4xl mb-4">📐</div>
              <h4 className="text-xl font-semibold mb-2">Architecture-First</h4>
              <p className="text-gray-600">
                Built for developers who care about clean architecture. Ultra-thin kernel, structural typing,
                and zero-dependency modularity enable true extensibility.
              </p>
            </div>
          </div>
        </section>

        {/* Core Primitives Section */}
        <section className="bg-white py-12 md:py-20 border-y border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h3 className="text-3xl md:text-4xl font-bold text-center mb-4">How It Works</h3>
            <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
              Amplifier is built on composable primitives that layer together to create powerful, reusable workflows
            </p>

            <div className="max-w-5xl mx-auto space-y-8">
              {/* Building Blocks */}
              <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-8 border border-purple-200">
                <h4 className="text-2xl font-bold mb-6 text-gray-900">Building Blocks</h4>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                    <div className="text-2xl mb-2">🔌</div>
                    <h5 className="font-semibold text-gray-900 mb-1">Providers</h5>
                    <p className="text-sm text-gray-600">External services and APIs that power your workflows</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                    <div className="text-2xl mb-2">🎯</div>
                    <h5 className="font-semibold text-gray-900 mb-1">Orchestrators</h5>
                    <p className="text-sm text-gray-600">Coordinate and manage workflow execution</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                    <div className="text-2xl mb-2">⚡</div>
                    <h5 className="font-semibold text-gray-900 mb-1">Skills</h5>
                    <p className="text-sm text-gray-600">Discrete capabilities that agents can use</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                    <div className="text-2xl mb-2">🤖</div>
                    <h5 className="font-semibold text-gray-900 mb-1">Agents</h5>
                    <p className="text-sm text-gray-600">Intelligent actors that perform tasks</p>
                  </div>
                </div>
              </div>

              {/* Bundles */}
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-8 border border-blue-200">
                <div className="flex items-start gap-4 mb-4">
                  <div className="text-4xl">📦</div>
                  <div className="flex-1">
                    <h4 className="text-2xl font-bold mb-2 text-gray-900">Bundles</h4>
                    <p className="text-gray-700 mb-4">
                      Bundles are composable collections of providers, orchestrators, skills, and agents.
                      They layer together to create increasingly sophisticated capabilities.
                    </p>
                  </div>
                </div>
                <div className="bg-white rounded-lg p-6 border border-blue-200">
                  <div className="flex items-center gap-3 text-sm font-mono text-gray-600">
                    <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded">Foundation Bundle</span>
                    <span>+</span>
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded">Code Review Bundle</span>
                    <span>+</span>
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded">Your Custom Bundle</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-4">
                    Bundles inherit and extend each other, enabling modular configuration and reuse
                  </p>
                </div>
              </div>

              {/* Recipes */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-8 border border-green-200">
                <div className="flex items-start gap-4 mb-4">
                  <div className="text-4xl">📋</div>
                  <div className="flex-1">
                    <h4 className="text-2xl font-bold mb-2 text-gray-900">Recipes</h4>
                    <p className="text-gray-700 mb-4">
                      Recipes are reusable, reliable processes composed of 1-n steps and Amplifier sessions.
                      They define <strong>what</strong> you want to accomplish, not <strong>how</strong> to do it.
                    </p>
                  </div>
                </div>
                <div className="bg-white rounded-lg p-6 border border-green-200">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
                      <span className="text-gray-700">Analyze code architecture</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
                      <span className="text-gray-700">Scan for bugs and issues</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
                      <span className="text-gray-700">Generate recommendations</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">4</div>
                      <span className="text-gray-700">Compile comprehensive report</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mt-4 pt-4 border-t border-gray-200">
                    Each step can involve multiple agents, skills, and even nested Amplifier sessions
                  </p>
                </div>
              </div>

              {/* The Stack Visualization */}
              <div className="bg-gradient-to-br from-gray-50 to-slate-100 rounded-xl p-8 border border-gray-300">
                <h4 className="text-xl font-bold mb-6 text-center text-gray-900">The Complete Stack</h4>
                <div className="flex flex-col gap-2 max-w-md mx-auto">
                  <div className="bg-green-500 text-white px-6 py-3 rounded-lg text-center font-semibold shadow">
                    Recipes (Declarative Workflows)
                  </div>
                  <div className="text-center text-gray-400 text-sm">↓ includes many ↓</div>
                  <div className="bg-blue-500 text-white px-6 py-3 rounded-lg text-center font-semibold shadow">
                    Bundles (Composable Collections)
                  </div>
                  <div className="text-center text-gray-400 text-sm">↓ each having many ↓</div>
                  <div className="bg-purple-500 text-white px-6 py-3 rounded-lg text-center font-semibold shadow">
                    Modules (Providers, Orchestrators, Skills, Agents)
                  </div>
                  <div className="text-center text-gray-400 text-sm">↓ that run on ↓</div>
                  <div className="bg-gray-700 text-white px-6 py-3 rounded-lg text-center font-semibold shadow">
                    Amplifier Core (Ultra-thin Kernel)
                  </div>
                </div>
                <p className="text-center text-sm text-gray-600 mt-6">
                  Each layer builds on the one below, creating a coherent, extensible architecture
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Who It's For Section */}
        <section className="bg-gradient-to-b from-blue-50 to-white py-12 md:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h3 className="text-3xl md:text-4xl font-bold text-center mb-4">Built For Builders</h3>
            <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
              Amplifier serves everyone who creates with technology, with deep focus on developers and architecture
            </p>

            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {/* Primary Audience */}
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-8 rounded-xl shadow-lg">
                <div className="text-4xl mb-4">💻</div>
                <h4 className="text-2xl font-bold mb-3">Developers</h4>
                <p className="text-blue-50 mb-4 text-sm">PRIMARY FOCUS</p>
                <p className="leading-relaxed mb-4">
                  Full development toolkit with AI-powered assistance. Deep architectural patterns,
                  composable workflows, and complete extensibility.
                </p>
                <ul className="text-sm text-blue-50 space-y-2">
                  <li>✓ Code-focused workflows</li>
                  <li>✓ Architecture patterns</li>
                  <li>✓ Module creation</li>
                  <li>✓ Full platform access</li>
                </ul>
              </div>

              {/* Secondary Audience */}
              <div className="bg-white p-8 rounded-xl shadow-lg border-2 border-blue-200">
                <div className="text-4xl mb-4">🔍</div>
                <h4 className="text-2xl font-bold mb-3 text-gray-900">Technical Adjacent</h4>
                <p className="text-gray-500 mb-4 text-sm">SECONDARY FOCUS</p>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Perfect for PMs, analysts, and designers who work with developers.
                  Understand systems, inspect workflows, and collaborate effectively.
                </p>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>✓ Analysis & inspection</li>
                  <li>✓ Read-only operations</li>
                  <li>✓ Structured workflows</li>
                  <li>✓ Team collaboration</li>
                </ul>
              </div>

              {/* Tertiary Audience */}
              <div className="bg-gray-50 p-8 rounded-xl shadow border border-gray-200">
                <div className="text-4xl mb-4">🎯</div>
                <h4 className="text-2xl font-bold mb-3 text-gray-700">Non-Technical</h4>
                <p className="text-gray-400 mb-4 text-sm">COMING SOON</p>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Simplified experiences for getting things done without code.
                  Pre-configured recipes and high-level outcomes.
                </p>
                <div className="inline-block px-4 py-2 bg-gray-200 text-gray-600 rounded-full text-sm font-medium mt-4">
                  More experiences coming
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why Amplifier Exists */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
          <div className="max-w-4xl mx-auto">
            <h3 className="text-3xl md:text-4xl font-bold text-center mb-8">Why Amplifier Exists</h3>
            <div className="bg-white rounded-xl shadow-lg p-8 md:p-12 border border-gray-200">
              <div className="space-y-6 text-gray-700 leading-relaxed">
                <p className="text-lg">
                  <strong className="text-gray-900">The Problem:</strong> Developers think of AI as "better autocomplete" or "vibe coding."
                  They're missing a fundamental shift: <strong className="text-blue-600">AI as composable middleware for building intelligent applications</strong>.
                </p>
                <p className="text-lg">
                  <strong className="text-gray-900">The Opportunity:</strong> When AI workflows are declarative, modular, and composable,
                  they become reproducible, shareable, and maintainable—just like great software architecture.
                </p>
                <p className="text-lg">
                  <strong className="text-gray-900">The Solution:</strong> Amplifier provides the infrastructure to make this real.
                  An ultra-thin kernel, composable bundles, and a thriving ecosystem of modules and recipes.
                </p>
                <div className="mt-8 pt-8 border-t border-gray-200">
                  <p className="text-xl text-center font-semibold text-gray-900">
                    We enable the future through experience, not just documentation.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 md:p-12 text-center text-white">
            <h3 className="text-3xl md:text-4xl font-bold mb-4">Ready to Build the Future?</h3>
            <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto opacity-90">
              Join developers transforming how intelligent applications are built.
              Experience the paradigm shift firsthand.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-blue-600 text-lg font-medium rounded-lg hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl hover:scale-105"
              >
                Try the Playground →
              </button>
              <a
                href="/system-overview"
                className="inline-flex items-center justify-center px-8 py-4 bg-blue-700 text-white text-lg font-medium rounded-lg hover:bg-blue-800 transition-all border-2 border-white/20"
              >
                Explore Architecture
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
