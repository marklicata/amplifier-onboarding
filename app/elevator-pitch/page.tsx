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
              Build Intelligent Applications,
              <br />
              Not Just Code
            </h2>
            <p className="text-xl md:text-2xl text-gray-700 mb-4 max-w-3xl mx-auto font-medium">
              Use AI to build applications, not just to autocomplete code.
            </p>
            <p className="text-lg text-gray-600 mb-8 max-w-3xl mx-auto">
              Amplifier lets you define what you want to build—not how to build it—and lets AI handle the work.
              Create reusable, modular workflows that you can share and extend.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => window.location.href = "/playground"}
                className="inline-flex items-center justify-center px-8 py-4 bg-blue-600 text-white text-lg font-medium rounded-lg hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl hover:scale-105"
              >
                Try It Now →
              </button>
              <a
                href="/system-overview"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-blue-600 text-lg font-medium rounded-lg hover:bg-gray-50 transition-all border-2 border-blue-600"
              >
                How it works
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
                    AI is used mostly for autocomplete instead of what it's really capable of.
                  </p>
                </div>
                <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl">
                  <div className="text-sm font-semibold text-blue-600 mb-3">TOMORROW</div>
                  <p className="text-gray-800 leading-relaxed font-medium">
                    Anyone describes what they want, AI handles the work,
                    and the results can be saved, shared, and reused.
                  </p>
                </div>
              </div>
              <p className="text-center text-xl text-gray-700 font-semibold">
                Amplifier is the bridge to that future.
              </p>
            </div>
          </div>
        </section>

        {/* Why Amplifier Exists */}
        <section className="bg-gradient-to-b from-gray-50 to-white py-12 md:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <h3 className="text-3xl md:text-4xl font-bold text-center mb-8">Why Amplifier?</h3>
              <div className="space-y-8">
                {/* The Problem */}
                <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 border border-gray-200">
                  <h4 className="text-xl font-bold mb-3 text-gray-900">The Problem</h4>
                  <p className="text-gray-700 leading-relaxed">
                    Current AI tools focus on quick edits—autocomplete, chat, or inline suggestions.
                    They're great for small changes, but not for thinking through bigger problems. Developers
                    end up copying, pasting, and manually coordinating what AI should be able to do on its own.
                  </p>
                </div>

                {/* When to Use Amplifier */}
                <div className="bg-blue-50 rounded-xl p-6 md:p-8 border border-blue-200">
                  <h4 className="text-xl font-bold mb-3 text-gray-900">When to Use Amplifier vs. Other Tools</h4>
                  <div className="space-y-4">
                    <div>
                      <p className="font-semibold text-blue-900 mb-1">Use Amplifier when you need:</p>
                      <ul className="text-gray-700 space-y-1 ml-4">
                        <li>• Multi-step workflows that coordinate multiple AI agents</li>
                        <li>• AI processes you can save and share with your team</li>
                        <li>• Custom tools and extensions for your specific needs</li>
                        <li>• Help with system design and architecture, not just code completion</li>
                      </ul>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-700 mb-1">Use GitHub Copilot/Claude Code when:</p>
                      <ul className="text-gray-600 space-y-1 ml-4">
                        <li>• You need quick inline suggestions and autocomplete</li>
                        <li>• Single-file edits are your primary workflow</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* What Makes Amplifier Different */}
                <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 border border-gray-200">
                  <h4 className="text-xl font-bold mb-3 text-gray-900">What Amplifier Solves Differently</h4>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    <strong className="text-blue-600">AI as building blocks</strong>, not just a coding assistant.
                    Amplifier lets you build reusable AI workflows that work like software you can share and extend.
                  </p>
                  <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-4">
                    <p className="text-gray-800 font-medium">
                      Create workflows that work the same way every time, not one-off conversations that disappear.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Who It's For Section */}
        <section className="bg-white py-12 md:py-20 border-y border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h3 className="text-3xl md:text-4xl font-bold text-center mb-4 text-gray-900">Key Use Cases</h3>
            <p className="text-center text-gray-600 mb-12 max-w-3xl mx-auto">
              Amplifier works best when you need AI to handle complex, multi-step work
            </p>

            <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto mb-12">
              {/* Use Case Cards */}
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200">
                <div className="text-3xl mb-3">🏗️</div>
                <h4 className="text-lg font-bold mb-2 text-gray-900">Multi-Agent Workflows</h4>
                <p className="text-gray-700 text-sm">
                  Coordinate different AI agents for analysis, planning, implementation, and review—all in one workflow.
                </p>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200">
                <div className="text-3xl mb-3">📦</div>
                <h4 className="text-lg font-bold mb-2 text-gray-900">Reusable AI Workflows</h4>
                <p className="text-gray-700 text-sm">
                  Package your team's expertise into bundles and recipes that anyone can use consistently.
                </p>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border border-green-200">
                <div className="text-3xl mb-3">🔧</div>
                <h4 className="text-lg font-bold mb-2 text-gray-900">Custom Tooling</h4>
                <p className="text-gray-700 text-sm">
                  Extend Amplifier with domain-specific tools, skills, and providers tailored to your ecosystem.
                </p>
              </div>

              <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-xl border border-orange-200">
                <div className="text-3xl mb-3">🔄</div>
                <h4 className="text-lg font-bold mb-2 text-gray-900">Reliable Processes</h4>
                <p className="text-gray-700 text-sm">
                  Define workflows once, run them reliably, and share them across teams—no more manual coordination.
                </p>
              </div>
            </div>

            {/* Audiences */}
            <div className="max-w-4xl mx-auto">
              <h4 className="text-2xl font-bold text-center mb-6 text-gray-900">Built for Developers First</h4>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-xl shadow-lg">
                  <div className="text-3xl mb-3">💻</div>
                  <h5 className="text-lg font-bold mb-2 text-white">Developers</h5>
                  <p className="text-blue-50 text-sm mb-2 font-semibold">PRIMARY</p>
                  <p className="text-sm leading-relaxed">
                    Full control over architecture, extensibility, and reusable workflows.
                  </p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow border-2 border-blue-200">
                  <div className="text-3xl mb-3">🔍</div>
                  <h5 className="text-lg font-bold mb-2 text-gray-900">Tech-Adjacent</h5>
                  <p className="text-gray-500 text-sm mb-2 font-semibold">SECONDARY</p>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    PMs and analysts who need structured workflows and inspection.
                  </p>
                </div>

                <div className="bg-gray-50 p-6 rounded-xl shadow border border-gray-200">
                  <div className="text-3xl mb-3">🎯</div>
                  <h5 className="text-lg font-bold mb-2 text-gray-700">Non-Technical</h5>
                  <p className="text-gray-400 text-sm mb-2 font-semibold">COMING SOON</p>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Pre-configured recipes for outcomes without code.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Core Value Props */}
        <section id="features" className="bg-gradient-to-b from-blue-50 to-white py-12 md:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h3 className="text-3xl md:text-4xl font-bold text-center mb-4 text-gray-900">What Makes Amplifier Different</h3>
            <p className="text-center text-gray-600 mb-12 max-w-3xl mx-auto">
              A platform that treats AI as reusable building blocks, not just a coding assistant
            </p>
            <div className="grid md:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-all">
                <div className="text-4xl mb-4">🎯</div>
                <h4 className="text-xl font-semibold mb-3 text-gray-900">Describe What You Want</h4>
                <p className="text-gray-600 mb-3">
                  Stop manually coordinating AI steps. Define what you want—Amplifier coordinates multiple agents,
                  tools, and workflows automatically.
                </p>
                <p className="text-sm text-blue-600 font-medium">
                  Much faster than chaining prompts manually
                </p>
              </div>
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-all">
                <div className="text-4xl mb-4">🔧</div>
                <h4 className="text-xl font-semibold mb-3 text-gray-900">Reliable, Reusable Workflows</h4>
                <p className="text-gray-600 mb-3">
                  Package AI processes into bundles and recipes you can share. No more one-off conversations—
                  build workflows that run the same way every time.
                </p>
                <p className="text-sm text-blue-600 font-medium">
                  Build once, use everywhere
                </p>
              </div>
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-all">
                <div className="text-4xl mb-4">📐</div>
                <h4 className="text-xl font-semibold mb-3 text-gray-900">Full Control</h4>
                <p className="text-gray-600 mb-3">
                  Lightweight core with no unnecessary dependencies. Extend everything—
                  providers, orchestrators, tools, and agents.
                </p>
                <p className="text-sm text-blue-600 font-medium">
                  Built for developers who want flexibility
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Core Primitives Section */}
        <section className="bg-white py-12 md:py-20 border-y border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h3 className="text-3xl md:text-4xl font-bold text-center mb-4 text-gray-900">Building Blocks</h3>
            <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
              Amplifier is built on simple components that work together to create powerful, reusable workflows
            </p>

            <div className="max-w-5xl mx-auto space-y-8">
              {/* Building Blocks */}
              <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-8 border border-purple-200">
                <h4 className="text-2xl font-bold mb-6 text-gray-900">Core Components</h4>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                    <div className="text-2xl mb-2">🔌</div>
                    <h5 className="font-semibold text-gray-900 mb-1">Providers</h5>
                    <p className="text-sm text-gray-600">External services and APIs that power your workflows</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                    <div className="text-2xl mb-2">🎯</div>
                    <h5 className="font-semibold text-gray-900 mb-1">Orchestrators</h5>
                    <p className="text-sm text-gray-600">Coordinate and manage how workflows run</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                    <div className="text-2xl mb-2">⚡</div>
                    <h5 className="font-semibold text-gray-900 mb-1">Skills</h5>
                    <p className="text-sm text-gray-600">Individual capabilities that agents can use</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                    <div className="text-2xl mb-2">🤖</div>
                    <h5 className="font-semibold text-gray-900 mb-1">Agents</h5>
                    <p className="text-sm text-gray-600">AI workers that perform tasks</p>
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
                      Bundles are collections of providers, orchestrators, skills, and agents.
                      Stack them together to build more advanced capabilities.
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
                    Bundles can build on each other, making it easy to configure and reuse them
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
                      Recipes are reusable processes made up of multiple steps.
                      They describe <strong>what</strong> you want to accomplish, not <strong>how</strong> to do it.
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
              {/* <div className="bg-gradient-to-br from-gray-50 to-slate-100 rounded-xl p-8 border border-gray-300">
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
              </div> */}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-b from-gray-50 to-white py-12 md:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 md:p-12 text-center text-white">
              <h3 className="text-3xl md:text-4xl font-bold mb-4">Ready to Get Started?</h3>
              <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto opacity-90">
                See how Amplifier can change the way you build intelligent applications.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => window.location.href = "/playground"}
                  className="inline-flex items-center justify-center px-8 py-4 bg-white text-blue-600 text-lg font-medium rounded-lg hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl hover:scale-105"
                >
                  Try the Playground →
                </button>
                <a
                  href="/system-overview"
                  className="inline-flex items-center justify-center px-8 py-4 bg-blue-700 text-white text-lg font-medium rounded-lg hover:bg-blue-800 transition-all border-2 border-white/20"
                >
                  Explore how it works
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
