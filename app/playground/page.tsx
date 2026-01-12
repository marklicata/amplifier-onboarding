'use client';

import { useState, useEffect, useRef } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ChatWindow from '@/components/ChatWindow';
import bundleMetadata from '@/lib/bundle-metadata.json';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface Bundle {
  id: string;
  name: string;
  description: string;
  bundlePath: string;
  icon: string;
  color: string;
  features: string[];
  suggestedPrompts: string[];
  tier: string;
}

export default function PlaygroundPage() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [selectedBundle, setSelectedBundle] = useState<Bundle | null>(null);
  const [bundleYaml, setBundleYaml] = useState<string>('');
  const [customPrompt, setCustomPrompt] = useState('');
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionResult, setExecutionResult] = useState<string | null>(null);
  const [executionError, setExecutionError] = useState<string | null>(null);
  const [isLoadingYaml, setIsLoadingYaml] = useState(false);
  const [isYamlCollapsed, setIsYamlCollapsed] = useState(false);
  const [isPromptCollapsed, setIsPromptCollapsed] = useState(false);
  const [executionStatus, setExecutionStatus] = useState<string>('');
  const resultRef = useRef<HTMLDivElement>(null);

  const bundles: Bundle[] = bundleMetadata.bundles;

  // Auto-scroll to bottom when new content arrives
  useEffect(() => {
    if (resultRef.current && isExecuting) {
      resultRef.current.scrollTop = resultRef.current.scrollHeight;
    }
  }, [executionResult, isExecuting]);

  // Load YAML content when bundle is selected
  useEffect(() => {
    if (selectedBundle) {
      loadBundleYaml(selectedBundle.bundlePath);
    }
  }, [selectedBundle]);

  const loadBundleYaml = async (bundlePath: string) => {
    setIsLoadingYaml(true);
    try {
      const response = await fetch(`/api/playground/bundle-yaml?path=${encodeURIComponent(bundlePath)}`);
      const data = await response.json();
      if (data.success) {
        setBundleYaml(data.yaml);
      } else {
        setBundleYaml(`# Error loading bundle\n# ${data.error}`);
      }
    } catch (error: any) {
      console.error('Error loading YAML:', error);
      setBundleYaml(`# Error loading bundle\n# ${error.message}`);
    } finally {
      setIsLoadingYaml(false);
    }
  };

  const handleSelectBundle = (bundle: Bundle) => {
    setSelectedBundle(bundle);
    setCustomPrompt('');
    setExecutionResult(null);
    setExecutionError(null);
    setIsYamlCollapsed(false); // Reset to expanded when selecting new bundle
    setIsPromptCollapsed(false); // Reset to expanded when selecting new bundle
  };

  const handlePromptSelect = (prompt: string) => {
    setCustomPrompt(prompt);
  };

  const handleExecute = async () => {
    if (!selectedBundle || !customPrompt.trim()) return;

    // Collapse bundle and prompt boxes when execution starts
    setIsYamlCollapsed(true);
    setIsPromptCollapsed(true);

    setIsExecuting(true);
    setExecutionResult('');
    setExecutionError(null);
    setExecutionStatus('Initializing...');

    try {
      const response = await fetch('/api/playground/execute-bundle-stream', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bundleId: selectedBundle.id,
          bundlePath: selectedBundle.bundlePath,
          prompt: customPrompt,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error('No response body');
      }

      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('event: ')) {
            const eventLines = line.split('\n');
            const eventLine = eventLines.find(l => l.startsWith('event: '));
            const dataLine = eventLines.find(l => l.startsWith('data: '));

            if (eventLine && dataLine) {
              const eventType = eventLine.substring(7).trim();
              const dataStr = dataLine.substring(6).trim();
              try {
                const data = JSON.parse(dataStr);
                handleStreamEvent(eventType, data);
              } catch (e) {
                console.error('Failed to parse SSE data:', dataStr);
              }
            }
          }
        }
      }
    } catch (error: any) {
      console.error('Execution error:', error);
      setExecutionError(`Failed to execute: ${error.message}`);
      setIsExecuting(false);
      setExecutionStatus('');
    }
  };

  const handleStreamEvent = (eventType: string, data: any) => {
    switch (eventType) {
      case 'status':
        setExecutionStatus(data.message || 'Processing...');
        break;

      case 'chunk':
        setExecutionResult(prev => (prev || '') + data.content);
        break;

      case 'step':
        setExecutionStatus(data.message || data.step);
        break;

      case 'progress':
        setExecutionStatus(data.message);
        break;

      case 'complete':
        setIsExecuting(false);
        setExecutionStatus('');
        if (data.output && !executionResult) {
          setExecutionResult(data.output);
        }
        break;

      case 'error':
        setIsExecuting(false);
        setExecutionStatus('');
        setExecutionError(data.error);
        break;
    }
  };

  return (
    <>
      <Header onOpenChat={() => setIsChatOpen(true)} />
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold mb-2">
              Amplifier Bundle Playground
            </h1>
            <p className="text-lg text-blue-100">
              Select a bundle, explore its configuration, and test it with your own prompts
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex gap-6">
            {/* Main Content Area - 2/3 width */}
            <div className="flex-1" style={{ minWidth: 0 }}>
              {selectedBundle ? (
                <>
                  {/* Bundle YAML Display Box */}
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
                    <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{selectedBundle.icon}</span>
                        <div>
                          <h2 className="text-xl font-bold text-gray-900">
                            {selectedBundle.name}
                          </h2>
                          <p className="text-sm text-gray-600">{selectedBundle.description}</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-6">
                      <button
                        onClick={() => setIsYamlCollapsed(!isYamlCollapsed)}
                        className="w-full text-left flex items-center justify-between mb-3 hover:bg-gray-50 p-2 rounded transition-colors"
                      >
                        <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                          <span>📄</span>
                          Bundle Configuration (YAML)
                        </h3>
                        <span className="text-gray-600 text-xl">
                          {isYamlCollapsed ? '+' : '−'}
                        </span>
                      </button>
                      {!isYamlCollapsed && (
                        isLoadingYaml ? (
                          <div className="bg-gray-50 rounded-lg p-8 text-center">
                            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                            <p className="text-sm text-gray-600 mt-2">Loading bundle configuration...</p>
                          </div>
                        ) : (
                          <div className="rounded-lg overflow-hidden">
                            <SyntaxHighlighter
                              language="yaml"
                              style={vscDarkPlus}
                              customStyle={{
                                margin: 0,
                                padding: '1rem',
                                fontSize: '0.875rem',
                                lineHeight: '1.5',
                              }}
                              showLineNumbers={true}
                            >
                              {bundleYaml}
                            </SyntaxHighlighter>
                          </div>
                        )
                      )}
                    </div>
                  </div>

                  {/* Prompt Box */}
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
                    <button
                      onClick={() => setIsPromptCollapsed(!isPromptCollapsed)}
                      className="w-full border-b border-gray-200 px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                    >
                      <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                        <span>✍️</span>
                        Your Prompt
                      </h3>
                      <span className="text-gray-600 text-xl">
                        {isPromptCollapsed ? '+' : '−'}
                      </span>
                    </button>
                    {!isPromptCollapsed && (
                      <div className="p-6">
                      {/* Encouragement Box */}
                      <div className="bg-gradient-to-r from-orange-50 to-red-50 border-2 border-orange-300 rounded-lg p-4 mb-4">
                        <p className="text-orange-900 font-bold text-lg mb-2">
                          🔥 Try to Break Amplifier!
                        </p>
                        <p className="text-orange-800 text-sm">
                          Don't hold back! Test edge cases, ask weird questions, push the limits. 
                          This is your chance to explore what Amplifier can (and can't) do. 
                          The more creative you get, the more you'll learn!
                        </p>
                      </div>

                      {/* Suggested Prompts */}
                      <div className="mb-4">
                        <p className="text-sm font-semibold text-gray-700 mb-2">Quick Start Prompts:</p>
                        <div className="flex flex-wrap gap-2">
                          {selectedBundle.suggestedPrompts.map((prompt, idx) => (
                            <button
                              key={idx}
                              onClick={() => handlePromptSelect(prompt)}
                              className={`px-3 py-2 text-sm rounded-lg border transition-all ${
                                customPrompt === prompt
                                  ? 'border-blue-500 bg-blue-50 text-blue-700 font-medium'
                                  : 'border-gray-300 bg-white text-gray-700 hover:border-blue-400 hover:bg-blue-50'
                              }`}
                            >
                              {prompt.substring(0, 50)}{prompt.length > 50 ? '...' : ''}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Prompt Textarea */}
                      <textarea
                        value={customPrompt}
                        onChange={(e) => setCustomPrompt(e.target.value)}
                        placeholder="Type your prompt here... or click a suggested prompt above"
                        className="w-full h-40 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white resize-none font-mono text-sm"
                      />
                      
                      <div className="flex justify-between items-center mt-4">
                        <p className="text-sm text-gray-500">
                          {customPrompt.length} characters
                        </p>
                        <button
                          onClick={handleExecute}
                          disabled={!customPrompt.trim() || isExecuting}
                          className={`px-8 py-3 rounded-lg font-bold text-white transition-all text-lg ${
                            !customPrompt.trim() || isExecuting
                              ? 'bg-gray-300 cursor-not-allowed'
                              : 'bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl'
                          }`}
                        >
                          {isExecuting ? (
                            <span className="flex items-center gap-2">
                              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                              </svg>
                              Executing...
                            </span>
                          ) : (
                            '🚀 Execute'
                          )}
                        </button>
                      </div>
                    </div>
                    )}
                  </div>

                  {/* Results Section - Separate Box */}
                  {(executionResult || executionError || isExecuting) && (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                      <div className="border-b border-gray-200 px-6 py-4">
                        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                          <span>📊</span>
                          {isExecuting ? 'Streaming Result...' : 'Result'}
                        </h3>
                      </div>
                      <div className="p-6">
                        {/* Execution Status */}
                        {isExecuting && executionStatus && (
                          <div className="mb-3 flex items-center gap-2 text-sm text-blue-600">
                            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            <span>{executionStatus}</span>
                          </div>
                        )}

                        {executionError ? (
                          <div className="bg-red-50 border-2 border-red-300 rounded-lg p-4">
                            <p className="text-red-800 font-bold mb-2">❌ Error:</p>
                            <pre className="text-red-700 text-sm whitespace-pre-wrap font-mono">
                              {executionError}
                            </pre>
                          </div>
                        ) : (
                          <div
                            ref={resultRef}
                            className="bg-white border border-gray-200 rounded-lg p-6"
                            style={{ maxHeight: '600px', overflowY: 'auto' }}
                          >
                            <div className="prose prose-sm max-w-none">
                              <ReactMarkdown
                                remarkPlugins={[remarkGfm]}
                                components={{
                                  code(props) {
                                    const {children, className, node, ...rest} = props as any;
                                    const match = /language-(\w+)/.exec(className || '');
                                    return match ? (
                                      <SyntaxHighlighter
                                        style={vscDarkPlus}
                                        language={match[1]}
                                        PreTag="div"
                                        customStyle={{
                                          margin: '1rem 0',
                                          borderRadius: '0.5rem',
                                          fontSize: '0.875rem',
                                        }}
                                      >
                                        {String(children).replace(/\n$/, '')}
                                      </SyntaxHighlighter>
                                    ) : (
                                      <code className={className} {...rest}>
                                        {children}
                                      </code>
                                    );
                                  }
                                }}
                              >
                                {executionResult}
                              </ReactMarkdown>
                              {isExecuting && executionResult && (
                                <span className="inline-block w-2 h-4 bg-blue-600 animate-pulse ml-1 align-middle"></span>
                              )}
                            </div>
                            {isExecuting && !executionResult && (
                              <div className="flex items-center justify-center py-8 text-gray-500">
                                <svg className="animate-spin h-8 w-8 text-blue-600" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                // No bundle selected - show welcome message
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                  <div className="text-6xl mb-4">👉</div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Select a Bundle to Get Started
                  </h2>
                  <p className="text-gray-600 max-w-md mx-auto">
                    Choose a bundle from the list on the right to see its configuration 
                    and start testing prompts.
                  </p>
                </div>
              )}
            </div>

            {/* Right Sidebar - Bundle List */}
            <div className="w-80 flex-shrink-0">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 sticky top-6">
                <div className="border-b border-gray-200 px-4 py-4">
                  <h3 className="text-lg font-bold text-gray-900">Available Bundles</h3>
                  <p className="text-xs text-gray-600 mt-1">Click to select</p>
                </div>
                <div className="p-3 space-y-2" style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}>
                  {bundles.map((bundle) => (
                    <button
                      key={bundle.id}
                      onClick={() => handleSelectBundle(bundle)}
                      className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                        selectedBundle?.id === bundle.id
                          ? 'border-blue-500 bg-blue-500 shadow-lg'
                          : 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-md'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="text-3xl">{bundle.icon}</div>
                        <div className="flex-1 min-w-0">
                          <h4 className={`font-bold mb-1 ${
                            selectedBundle?.id === bundle.id ? 'text-white' : 'text-gray-900'
                          }`}>
                            {bundle.name}
                          </h4>
                          <p className={`text-xs ${
                            selectedBundle?.id === bundle.id ? 'text-white' : 'text-gray-600'
                          }`}>
                            {bundle.description.substring(0, 80)}...
                          </p>
                          <div className={`mt-2 inline-block px-2 py-1 rounded text-xs font-medium ${
                            selectedBundle?.id === bundle.id 
                              ? 'bg-white bg-opacity-20 text-white' 
                              : 'bg-gray-100 text-gray-700'
                          }`}>
                            {bundle.tier}
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
                <div className="border-t border-gray-200 px-4 py-3 text-s text-gray-700">
                  ...more bundles coming soon!
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Window */}
      <ChatWindow isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />

      <Footer />
    </>
  );
}
