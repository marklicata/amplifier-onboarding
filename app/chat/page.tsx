'use client';

import { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { trackEvent, trackException, getOrCreateIdentity } from '@/lib/telemetry';
import Header from '@/components/Header';
import ConfigPanel from '@/components/chat/ConfigPanel';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hi! I'm Amplifier, and I love talking about myself! 🤖\n\nAsk me anything about how I work, what I can do, or why I exist. I'm here to help you understand the future of AI development.",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [amplifierSessionId, setAmplifierSessionId] = useState<string | null>(null);
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [isReloadingSession, setIsReloadingSession] = useState(false);
  const sessionStartTime = useRef<number>(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Track page view
  useEffect(() => {
    sessionStartTime.current = Date.now();
    trackEvent('chat_page_opened', {
      from_page: typeof window !== 'undefined' ? document.referrer : '',
    });

    return () => {
      const duration = Date.now() - sessionStartTime.current;
      trackEvent('chat_page_closed', {
        message_count: messages.length,
        session_duration_ms: duration,
      });
    };
  }, []);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const identity = getOrCreateIdentity();
    const messageStartTime = performance.now();

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const messageContent = input;
    setInput('');
    setIsLoading(true);

    trackEvent('chat_message_sent', {
      message_length: messageContent.length,
      message_number: messages.length,
      session_id: identity.session_id,
      is_first_message: messages.length === 1,
    });

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: messageContent,
          sessionId: amplifierSessionId || undefined,
          userId: identity.anonymous_id,
        }),
      });

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      if (data.session_id && data.session_id !== amplifierSessionId) {
        console.log(`Amplifier session created/updated: ${data.session_id}`);
        setAmplifierSessionId(data.session_id);
      }

      const messageEndTime = performance.now();

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response,
        timestamp: new Date(data.timestamp),
      };

      setMessages((prev) => [...prev, assistantMessage]);

      trackEvent('chat_response_received', {
        response_length: data.response.length,
        response_time_ms: messageEndTime - messageStartTime,
        session_id: identity.session_id,
        amplifier_session_id: data.session_id,
        success: true,
      });
    } catch (error: any) {
      console.error('Chat error:', error);

      const messageEndTime = performance.now();

      trackException(error, {
        context: 'chat_interaction',
        session_id: identity.session_id,
        amplifier_session_id: amplifierSessionId,
        message_length: messageContent.length,
        response_time_ms: messageEndTime - messageStartTime,
      });

      trackEvent('chat_error', {
        error_message: error.message,
        response_time_ms: messageEndTime - messageStartTime,
        session_id: identity.session_id,
        amplifier_session_id: amplifierSessionId,
      });

      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `Sorry, I encountered an error: ${error.message}\n\nPlease try again or check the System Overview page to learn more about me!`,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleConfigSave = async () => {
    setIsReloadingSession(true);
    setIsConfigOpen(false);

    // Show reload message
    const reloadMessage: Message = {
      id: Date.now().toString(),
      role: 'assistant',
      content: '⚙️ Reloading session with your new config...',
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, reloadMessage]);

    // Simulate session reload (in practice, this would create a new session with the new bundle)
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Clear the old session ID so a new one is created
    setAmplifierSessionId(null);

    // Show ready message
    const readyMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: '✅ Ready! Your new configuration is active.',
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, readyMessage]);

    setIsReloadingSession(false);

    trackEvent('chat_config_applied', {
      session_reloaded: true,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Site Header with Navigation */}
      <Header />

      {/* Chat Page Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-3xl">
                🤖
              </div>
              <div>
                <h1 className="font-bold text-2xl">Ask Amplifier</h1>
                <p className="text-sm text-blue-100">Powered by Amplifier itself</p>
              </div>
            </div>
            <button
              onClick={() => setIsConfigOpen(!isConfigOpen)}
              className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors flex items-center gap-2"
              disabled={isReloadingSession}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Configure
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto space-y-4 mb-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-4 ${
                  message.role === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-800 border border-gray-200 shadow-sm'
                }`}
              >
                {message.role === 'assistant' ? (
                  <div className="prose prose-sm max-w-none prose-headings:mt-3 prose-headings:mb-2 prose-p:my-2 prose-ul:my-2 prose-ol:my-2 prose-li:my-0.5 prose-code:bg-gray-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-gray-800 prose-code:break-words prose-pre:bg-gray-100 prose-pre:text-gray-800 prose-pre:overflow-x-auto prose-pre:max-w-full [&_pre]:whitespace-pre-wrap [&_pre]:break-words [&_code]:break-words [&_pre_code]:whitespace-pre-wrap">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {message.content}
                    </ReactMarkdown>
                  </div>
                ) : (
                  <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
                )}
                <p
                  className={`text-xs mt-2 ${
                    message.role === 'user' ? 'text-blue-100' : 'text-gray-500'
                  }`}
                >
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                <div className="flex gap-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="border-t border-gray-200 bg-white rounded-lg shadow-sm p-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything about Amplifier..."
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white"
              disabled={isLoading || isReloadingSession}
            />
            <button
              onClick={handleSendMessage}
              disabled={!input.trim() || isLoading || isReloadingSession}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              Send
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Press Enter to send, Shift+Enter for new line
          </p>
        </div>
      </div>

      {/* Config Panel */}
      {isConfigOpen && (
        <ConfigPanel
          onClose={() => setIsConfigOpen(false)}
          onSave={handleConfigSave}
        />
      )}
    </div>
  );
}
