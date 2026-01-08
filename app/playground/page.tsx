'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ChatWindow from '@/components/ChatWindow';
import ExampleBrowser from '@/components/playground/ExampleBrowser';
import ExampleViewer from '@/components/playground/ExampleViewer';
import StreamingExecutionPanel from '@/components/playground/StreamingExecutionPanel';

export default function PlaygroundPage() {
  const [selectedExampleId, setSelectedExampleId] = useState<string | undefined>(undefined);
  const [executing, setExecuting] = useState(false);
  const [executionInputs, setExecutionInputs] = useState<any>({});
  const [executionMode, setExecutionMode] = useState<string>('developers');
  const [showExecutionPanel, setShowExecutionPanel] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [showHowToUse, setShowHowToUse] = useState(false);

  const handleSelectExample = (exampleId: string) => {
    setSelectedExampleId(exampleId);
  };

  const handleExecute = (exampleId: string, inputs?: any) => {
    setExecuting(true);
    setShowExecutionPanel(true);
    setExecutionInputs(inputs || {});
    setExecutionMode('developers');
  };

  const handleExecutionComplete = (result: any) => {
    setExecuting(false);
    // Result is already displayed in the StreamingExecutionPanel
  };

  const handleCloseExecutionPanel = () => {
    if (!executing) {
      setShowExecutionPanel(false);
      setExecuting(false);
    }
  };

  return (
    <>
      <Header onOpenChat={() => setIsChatOpen(true)} />
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-4xl font-bold mb-4">
              Amplifier Playground
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl">
              Explore interactive examples from amplifier-foundation. See AI agents in action, 
              learn how they work, and run them right in your browser.
            </p>
            <div className="mt-6 flex gap-4 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🎯</span>
                <span>Beginner-friendly examples</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">🔧</span>
                <span>Real Amplifier code</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">🚀</span>
                <span>Run in seconds</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* How to Use Section - Collapsible */}
          <div className="mb-8 bg-blue-50 border border-blue-200 rounded-lg overflow-hidden">
            <button
              onClick={() => setShowHowToUse(!showHowToUse)}
              className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-blue-100 transition-colors"
            >
              <h3 className="text-lg font-semibold text-blue-900 flex items-center gap-2">
                <span>💡</span>
                <span>How to Use the Playground</span>
              </h3>
              <span className="text-blue-600 text-xl">
                {showHowToUse ? '−' : '+'}
              </span>
            </button>
            {showHowToUse && (
              <div className="px-6 pb-6">
                <ol className="list-decimal list-inside space-y-2 text-blue-800 mb-4">
                  <li><strong>Browse Examples:</strong> Filter by tier, category, or search by keyword</li>
                  <li><strong>Choose Your View:</strong> Switch between Everyone, Developers, or Experts views to match your technical level</li>
                  <li><strong>Run Examples:</strong> Click "Run Example" to execute the code with Amplifier</li>
                  <li><strong>Customize (Optional):</strong> Some examples let you provide custom inputs</li>
                  <li><strong>Learn:</strong> See real AI agents in action and learn from the results</li>
                </ol>
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded">
                  <p className="text-sm text-yellow-800">
                    <strong>Note:</strong> Examples run on the server using your Amplifier Foundation installation. 
                    First-time execution may take 10-30 seconds as modules are downloaded and cached.
                  </p>
                </div>
              </div>
            )}
          </div>

          {selectedExampleId ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Sidebar - Example Browser (collapsed on desktop) */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-gray-900">Examples</h2>
                    <button
                      onClick={() => setSelectedExampleId(undefined)}
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      ← Back to all
                    </button>
                  </div>
                  <ExampleBrowser
                    onSelectExample={handleSelectExample}
                    selectedId={selectedExampleId}
                  />
                </div>
              </div>

              {/* Main Content - Example Viewer */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <ExampleViewer
                    exampleId={selectedExampleId}
                    onExecute={handleExecute}
                    executing={executing}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Choose an Example to Get Started
                </h2>
                <p className="text-gray-600">
                  Browse through our curated examples below. Each example demonstrates 
                  different Amplifier capabilities, from simple "Hello World" to complex 
                  multi-agent systems.
                </p>
              </div>
              <ExampleBrowser
                onSelectExample={handleSelectExample}
                selectedId={selectedExampleId}
              />
            </div>
          )}
        </div>

        {/* Features Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="text-3xl mb-3">📚</div>
              <h3 className="font-semibold text-gray-900 mb-2">Progressive Learning</h3>
              <p className="text-sm text-gray-600">
                Start with Tier 1 basics, progress through foundation concepts, 
                and master advanced patterns at your own pace.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="text-3xl mb-3">🎨</div>
              <h3 className="font-semibold text-gray-900 mb-2">Adaptive Interface</h3>
              <p className="text-sm text-gray-600">
                Switch between Simple, Explorer, Developer, and Expert views. 
                Same example, different depth - tailored to your needs.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="text-3xl mb-3">⚡</div>
              <h3 className="font-semibold text-gray-900 mb-2">Real Execution</h3>
              <p className="text-sm text-gray-600">
                These aren't demos or mockups - they're actual amplifier-foundation 
                examples running with real AI providers.
              </p>
            </div>
          </div>
        </div>

        {/* Execution Panel Modal */}
        <StreamingExecutionPanel
          isOpen={showExecutionPanel}
          onClose={handleCloseExecutionPanel}
          exampleId={selectedExampleId || ''}
          inputs={executionInputs}
          mode={executionMode}
          onComplete={handleExecutionComplete}
        />
      </div>

      {/* Chat Window */}
      <ChatWindow isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />

      <Footer />
    </>
  );
}
