'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ChatWindow from '@/components/ChatWindow';
import Link from 'next/link';

export default function Overview() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-50 to-white">
      <Header onOpenChat={() => setIsChatOpen(true)} />
      <ChatWindow isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />

      <main className="flex-1">
        {/* Hero + Vision */}
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
          </div>
        </section>

        {/* Vision Section */}
        <section className="bg-white py-12 md:py-20 border-y border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <h3 className="text-3xl md:text-4xl font-bold text-center mb-8 text-gray-900">Our Vision</h3>
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

        {/* The Paradigm Shift */}
        <section className="bg-gradient-to-b from-gray-50 to-white py-12 md:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
              <h3 className="text-3xl md:text-4xl font-bold text-center mb-8 text-gray-900">The Paradigm Shift</h3>
              
              <div className="grid md:grid-cols-2 gap-8 mb-12">
                <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
                  <h4 className="text-xl font-bold mb-4 text-gray-900">AS-IS: Fixed Feature Sets</h4>
                  <ul className="space-y-3 text-gray-700">
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Apps ship with predetermined capabilities</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>AI bolted on as specific features</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Extensions require rebuild and vendor release</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Each org uses same AI regardless of context</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2">•</span>
                      <span>Intelligence is <strong>a feature</strong> you get or don't get</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl shadow-lg p-8 border-2 border-blue-300">
                  <h4 className="text-xl font-bold mb-4 text-gray-900">TO-BE: Composable Intelligence Platforms</h4>
                  <ul className="space-y-3 text-gray-800">
                    <li className="flex items-start">
                      <span className="mr-2 text-blue-600">✓</span>
                      <span>Apps ship with <strong>extensibility infrastructure</strong></span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2 text-blue-600">✓</span>
                      <span>AI becomes <strong>modular building blocks</strong> that compose</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2 text-blue-600">✓</span>
                      <span>Extensions mean loading bundles—no rebuild needed</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2 text-blue-600">✓</span>
                      <span>Each org assembles AI matching their needs</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2 text-blue-600">✓</span>
                      <span>Intelligence is <strong>infrastructure</strong> you compose</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                <p className="text-lg text-gray-800 text-center font-medium">
                  Applications become <strong>hosting environments</strong> for modular intelligence, 
                  not deliverers of fixed intelligence.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Why Amplifier */}
        <section className="bg-gradient-to-b from-white to-gray-50 py-12 md:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <h3 className="text-3xl md:text-4xl font-bold text-center mb-8 text-gray-900">Why Amplifier?</h3>
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

                {/* When to Use */}
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

                {/* What Makes Different */}
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

        {/* Platform vs Product */}
        <section className="bg-white py-12 md:py-20 border-y border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <h3 className="text-3xl md:text-4xl font-bold text-center mb-8 text-gray-900">Platform vs Product: What Amplifier Actually Is</h3>
              
              <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl shadow-lg p-8 mb-8 border-2 border-purple-200">
                <h4 className="text-2xl font-bold mb-4 text-gray-900 text-center">The Core Distinction</h4>
                <p className="text-xl text-center mb-6 text-gray-800 font-semibold">
                  Think of Amplifier like AWS, not like Dropbox
                </p>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-white rounded-lg p-6">
                    <h5 className="font-bold mb-3 text-gray-900">Copilot/Cursor/Claude are <span className="text-purple-600">Products</span></h5>
                    <p className="text-gray-700 text-sm">
                      Finished tools you install and use for specific tasks (code completion, chat, file editing)
                    </p>
                  </div>
                  <div className="bg-blue-100 rounded-lg p-6 border-2 border-blue-400">
                    <h5 className="font-bold mb-3 text-gray-900">Amplifier is <span className="text-blue-600">Infrastructure</span></h5>
                    <p className="text-gray-700 text-sm font-medium">
                      What you use to <em>build</em> products like those. A platform for creating AI workflows and applications.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                  <h4 className="text-lg font-bold mb-3 text-gray-900">The Comparison People Want</h4>
                  <p className="text-gray-700 mb-2">"Copilot is for autocomplete" vs "Amplifier is for...?"</p>
                  <div className="bg-blue-50 rounded-lg p-4 mt-3">
                    <p className="font-semibold text-gray-900">The Real Comparison:</p>
                    <ul className="mt-2 space-y-1 text-gray-700">
                      <li>• Copilot is <strong>a product built on an LLM</strong></li>
                      <li>• Amplifier is <strong>a platform to build products with LLMs</strong></li>
                    </ul>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-green-50 rounded-lg p-6 border border-green-200">
                    <h5 className="font-bold mb-3 text-green-900">Use Amplifier When You Want To:</h5>
                    <ul className="space-y-2 text-gray-700 text-sm">
                      <li>✓ Build custom code review tools for your team</li>
                      <li>✓ Create multi-agent workflows for data analysis</li>
                      <li>✓ Package your team's expertise into reusable AI processes</li>
                      <li>✓ Build custom AI-powered applications</li>
                    </ul>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                    <h5 className="font-bold mb-3 text-gray-700">Use Copilot/Others When:</h5>
                    <ul className="space-y-2 text-gray-600 text-sm">
                      <li>• You need inline autocomplete</li>
                      <li>• Quick code suggestions</li>
                      <li>• Pre-built, ready-to-use functionality</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-purple-50 rounded-lg p-6 border border-purple-200">
                  <p className="text-lg text-gray-800 font-medium text-center">
                    "Amplifier isn't competing with Copilot any more than <strong>React competes with WordPress</strong>. 
                    They're different layers of the stack."
                  </p>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                  <h4 className="text-lg font-bold mb-3 text-gray-900">Who Should Care</h4>
                  <p className="text-xl text-blue-600 font-semibold mb-2">
                    Developers who want to <em>build</em> AI-powered tools, not just <em>use</em> them.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Key Capabilities Unlocked - TO BE CONTINUED IN NEXT PART */}
        <section className="bg-gradient-to-b from-gray-50 to-white py-12 md:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h3 className="text-3xl md:text-4xl font-bold text-center mb-4 text-gray-900">Key Capabilities Unlocked</h3>
            <p className="text-center text-gray-600 mb-12 max-w-3xl mx-auto">
              What becomes possible when applications become composable intelligence platforms
            </p>
            
            <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <div className="text-3xl mb-3">🏢</div>
                <h4 className="text-xl font-semibold mb-2 text-gray-900">Org-Specific Intelligence</h4>
                <p className="text-gray-600 text-sm">
                  Load bundles that encode your company's architecture patterns, security policies, and workflows. 
                  Not generic AI—intelligence that knows how <em>your</em> organization works.
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <div className="text-3xl mb-3">🔄</div>
                <h4 className="text-xl font-semibold mb-2 text-gray-900">Dynamic Capability Composition</h4>
                <p className="text-gray-600 text-sm">
                  Switch contexts instantly by loading different bundles. Same application, different intelligence 
                  based on whether you're working on finance, healthcare, or aerospace projects.
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <div className="text-3xl mb-3">🤝</div>
                <h4 className="text-xl font-semibold mb-2 text-gray-900">Multi-Agent Workflows</h4>
                <p className="text-gray-600 text-sm">
                  Coordinate specialized agents in declarative recipes. Architecture agent → Security agent → 
                  Test coverage agent → Documentation agent. Each brings different expertise.
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <div className="text-3xl mb-3">🧠</div>
                <h4 className="text-xl font-semibold mb-2 text-gray-900">Context-Aware Intelligence</h4>
                <p className="text-gray-600 text-sm">
                  Bundles that learn from your codebase, enforce your documentation standards, and adapt to your 
                  team's patterns. Intelligence that gets smarter as it works with you.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTAs */}
        <section className="bg-gradient-to-r from-blue-600 to-purple-600 py-12 md:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h3 className="text-3xl font-bold mb-6 text-white">Explore Further</h3>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/examples/vs-code"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-blue-600 text-lg font-medium rounded-lg hover:bg-gray-100 transition-all shadow-lg"
              >
                See Real Examples →
              </Link>
              <Link
                href="/system-overview"
                className="inline-flex items-center justify-center px-8 py-4 bg-blue-700 text-white text-lg font-medium rounded-lg hover:bg-blue-800 transition-all border-2 border-white/20"
              >
                Understand the Architecture
              </Link>
              <Link
                href="/playground"
                className="inline-flex items-center justify-center px-8 py-4 bg-purple-700 text-white text-lg font-medium rounded-lg hover:bg-purple-800 transition-all border-2 border-white/20"
              >
                Try It Yourself
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

