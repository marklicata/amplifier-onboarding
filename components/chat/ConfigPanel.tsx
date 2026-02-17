'use client';

import { useState, useEffect } from 'react';
import { getOrCreateIdentity } from '@/lib/telemetry';

interface ConfigPanelProps {
  onClose: () => void;
  onSave: () => void;
}

interface BundleConfig {
  provider: 'anthropic' | 'openai';
  apiKey: string;
  model: string;
  tools: string[];
  orchestrator: string;
  context: string;
  hooks: string[];
  instructions: string;
}

// Module sources mapping
const MODULE_SOURCES = {
  providers: {
    anthropic: 'git+https://github.com/microsoft/amplifier-module-provider-anthropic@main',
    openai: 'git+https://github.com/microsoft/amplifier-module-provider-openai@main',
  },
  tools: {
    'tool-filesystem': 'git+https://github.com/microsoft/amplifier-module-tool-filesystem@main',
    'tool-web': 'git+https://github.com/microsoft/amplifier-module-tool-web@main',
    'tool-bash': 'git+https://github.com/microsoft/amplifier-module-tool-bash@main',
    'tool-search': 'git+https://github.com/microsoft/amplifier-module-tool-search@main',
  },
  orchestrators: {
    'loop-basic': 'git+https://github.com/microsoft/amplifier-module-loop-basic@main',
    'loop-streaming': 'git+https://github.com/microsoft/amplifier-module-loop-streaming@main',
  },
  context: {
    'context-simple': 'git+https://github.com/microsoft/amplifier-module-context-simple@main',
    'context-persistent': 'git+https://github.com/microsoft/amplifier-module-context-persistent@main',
  },
  hooks: {
    'streaming-ui': 'git+https://github.com/microsoft/amplifier-module-hooks-streaming-ui@main',
    'status-context': 'git+https://github.com/microsoft/amplifier-module-hooks-status-context@main',
    'redaction': 'git+https://github.com/microsoft/amplifier-module-hooks-redaction@main',
    'logging': 'git+https://github.com/microsoft/amplifier-module-hooks-logging@main',
    'approval': 'git+https://github.com/microsoft/amplifier-module-hooks-approval@main',
    'todo-reminder': 'git+https://github.com/microsoft/amplifier-module-hooks-todo-reminder@main',
  },
};

const DEFAULT_INSTRUCTIONS = `You are a helpful AI assistant powered by Amplifier, a modular AI agent framework.

Your role is to answer questions about Amplifier - its architecture, capabilities, and how to use it effectively.

Key topics you can help with:
- Amplifier's modular architecture (kernel, modules, bundles)
- How to create and configure bundles
- Available modules (providers, tools, orchestrators, context managers, hooks)
- Best practices for building AI applications with Amplifier
- Troubleshooting and debugging Amplifier applications

Be clear, concise, and helpful in your responses. Use examples when appropriate.`;

const MODEL_OPTIONS = {
  anthropic: [
    { value: 'claude-opus-4-5', label: 'Claude Opus 4.5' },
    { value: 'claude-opus-4-6', label: 'Claude Opus 4.6' },
    { value: 'claude-sonnet-4-5', label: 'Claude Sonnet 4.5' },
    { value: 'claude-haiku-4-5', label: 'Claude Haiku 4.5' },
  ],
  openai: [
    { value: 'gpt-5.2', label: 'GPT-5.2' },
    { value: 'gpt-5.1-codex-max', label: 'GPT-5.1 Codex Max' },
  ],
};

const TOOL_DESCRIPTIONS = {
  'tool-filesystem': 'Read, write, and manage files and directories',
  'tool-web': 'Fetch and browse web content from URLs',
  'tool-bash': 'Execute shell commands and scripts',
  'tool-search': 'Search the web for information',
};

const ORCHESTRATOR_DESCRIPTIONS = {
  'loop-basic': 'Standard request-response processing',
  'loop-streaming': 'Real-time streaming responses as they generate',
};

const CONTEXT_DESCRIPTIONS = {
  'context-simple': 'In-memory conversation history (current session only)',
  'context-persistent': 'Persistent conversation history across sessions',
};

const HOOK_DESCRIPTIONS = {
  'streaming-ui': 'Real-time UI updates during processing',
  'status-context': 'Track and display operation status',
  'redaction': 'Automatically redact sensitive information from logs',
  'logging': 'Log all interactions for debugging and audit',
  'approval': 'Require approval before executing certain operations',
  'todo-reminder': 'Track and remind about pending tasks',
};

interface BundlePreset {
  id: string;
  name: string;
  description: string;
  data: any;
}

export default function ConfigPanel({ onClose, onSave }: ConfigPanelProps) {
  const [config, setConfig] = useState<BundleConfig>({
    provider: 'anthropic',
    apiKey: '',
    model: 'claude-sonnet-4-5',
    tools: ['tool-web'],
    orchestrator: 'loop-basic',
    context: 'context-simple',
    hooks: [],
    instructions: DEFAULT_INSTRUCTIONS,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [presets, setPresets] = useState<BundlePreset[]>([]);
  const [selectedPreset, setSelectedPreset] = useState<string>('');

  useEffect(() => {
    loadConfig();
    loadPresets();
  }, []);

  const loadConfig = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const identity = getOrCreateIdentity();
      const response = await fetch('/api/config', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-User-ID': identity.anonymous_id,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to load configuration');
      }

      const data = await response.json();

      // If we have a saved config, parse it
      if (data.config) {
        setConfig({
          provider: data.config.provider || 'anthropic',
          apiKey: data.config.apiKey || '',
          model: data.config.model || 'claude-sonnet-4-5',
          tools: data.config.tools || ['tool-web'],
          orchestrator: data.config.orchestrator || 'loop-basic',
          context: data.config.context || 'context-simple',
          hooks: data.config.hooks || [],
          instructions: data.config.instructions || DEFAULT_INSTRUCTIONS,
        });
      }
    } catch (err: any) {
      console.error('Failed to load config:', err);
      setError(err.message);
      // Keep default config on error
    } finally {
      setIsLoading(false);
    }
  };

  const loadPresets = async () => {
    try {
      const response = await fetch('/api/bundles');
      if (!response.ok) {
        throw new Error('Failed to load bundle presets');
      }

      const data = await response.json();
      setPresets(data.bundles || []);
    } catch (err: any) {
      console.error('Failed to load presets:', err);
      // Non-critical, just log and continue
    }
  };

  const parseBundle = (bundleData: any): Partial<BundleConfig> => {
    const parsed: Partial<BundleConfig> = {};

    // Parse provider
    if (bundleData.providers && bundleData.providers.length > 0) {
      const provider = bundleData.providers[0];
      const providerModule = provider.module || '';
      
      if (providerModule.includes('anthropic')) {
        parsed.provider = 'anthropic';
      } else if (providerModule.includes('openai')) {
        parsed.provider = 'openai';
      }

      // Parse model
      if (provider.config?.default_model) {
        parsed.model = provider.config.default_model;
      }
    }

    // Parse tools (always set, even if empty)
    if (bundleData.tools && Array.isArray(bundleData.tools)) {
      parsed.tools = bundleData.tools.map((tool: any) => tool.module).filter((m: string) => m.startsWith('tool-'));
    } else {
      parsed.tools = [];
    }

    // Parse session config
    if (bundleData.session) {
      if (bundleData.session.orchestrator?.module) {
        parsed.orchestrator = bundleData.session.orchestrator.module;
      }
      if (bundleData.session.context?.module) {
        parsed.context = bundleData.session.context.module;
      }
    }

    // Parse hooks (always set, even if empty)
    if (bundleData.hooks && Array.isArray(bundleData.hooks)) {
      parsed.hooks = bundleData.hooks.map((hook: any) => hook.module);
    } else {
      parsed.hooks = [];
    }

    // Parse instructions
    if (bundleData.instruction) {
      parsed.instructions = bundleData.instruction;
    } else {
      parsed.instructions = DEFAULT_INSTRUCTIONS;
    }

    return parsed;
  };

  const handlePresetChange = (presetId: string) => {
    setSelectedPreset(presetId);
    
    if (!presetId) return;

    const preset = presets.find(p => p.id === presetId);
    if (!preset) return;

    const parsedConfig = parseBundle(preset.data);
    
    setConfig(prev => ({
      ...prev,
      ...parsedConfig,
      // Keep the user's API key
      apiKey: prev.apiKey,
    }));
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      setError(null);

      const identity = getOrCreateIdentity();

      // Build the bundle JSON
      const bundle = {
        name: 'user-custom-bundle',
        description: 'User-configured chat bundle',
        config_data: {
          bundle: {
            name: 'user-custom-bundle',
            version: '1.0.0',
            description: 'User-configured chat bundle',
          },
        },
        tags: {
          source: 'onboarding-app',
          type: 'bundle',
          user_id: identity.anonymous_id,
        },
        session: {
          orchestrator: {
            module: config.orchestrator,
            source: MODULE_SOURCES.orchestrators[config.orchestrator as keyof typeof MODULE_SOURCES.orchestrators],
          },
          context: {
            module: config.context,
            source: MODULE_SOURCES.context[config.context as keyof typeof MODULE_SOURCES.context],
          },
        },
        providers: [
          {
            module: `provider-${config.provider}`,
            source: MODULE_SOURCES.providers[config.provider],
            config: {
              default_model: config.model,
              debug: true,
              raw_debug: true,
              api_key: config.apiKey || (config.provider === 'anthropic' ? '${ANTHROPIC_API_KEY}' : '${OPENAI_API_KEY}'),
            },
          },
        ],
        tools: config.tools.map((tool) => ({
          module: tool,
          source: MODULE_SOURCES.tools[tool as keyof typeof MODULE_SOURCES.tools],
        })),
        hooks: config.hooks.map((hook) => ({
          module: hook,
          source: MODULE_SOURCES.hooks[hook as keyof typeof MODULE_SOURCES.hooks],
        })),
        instruction: config.instructions,
      };

      // Save to API
      const response = await fetch('/api/config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-ID': identity.anonymous_id,
        },
        body: JSON.stringify({
          config,
          bundle,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save configuration');
      }

      // Call parent's onSave to trigger session reload
      onSave();
    } catch (err: any) {
      console.error('Failed to save config:', err);
      setError(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const toggleTool = (tool: string) => {
    setConfig((prev) => ({
      ...prev,
      tools: prev.tools.includes(tool)
        ? prev.tools.filter((t) => t !== tool)
        : [...prev.tools, tool],
    }));
  };

  const toggleHook = (hook: string) => {
    setConfig((prev) => ({
      ...prev,
      hooks: prev.hooks.includes(hook)
        ? prev.hooks.filter((h) => h !== hook)
        : [...prev.hooks, hook],
    }));
  };

  const maskApiKey = (key: string) => {
    if (!key || key.length < 8) return '••••••••';
    return key.substring(0, 8) + '••••••';
  };

  if (isLoading) {
    return (
      <>
        <div className="fixed inset-0 bg-black bg-opacity-30 z-50" onClick={onClose} />
        <div className="fixed right-0 top-0 h-full w-full md:w-[600px] bg-white shadow-2xl z-50 flex items-center justify-center">
          <div className="text-gray-500">Loading configuration...</div>
        </div>
      </>
    );
  }

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black bg-opacity-30 z-50" onClick={onClose} />

      {/* Panel */}
      <div className="fixed right-0 top-0 h-full w-full md:w-[600px] bg-white shadow-2xl z-50 flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <div>
              <h3 className="font-bold text-lg">Configure Chat Experience</h3>
              <p className="text-sm text-blue-100">Customize your Amplifier setup</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white hover:text-gray-200 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Preset Selector */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              📦 Load a Preset Configuration
              <span className="ml-2 text-xs font-normal text-gray-600">
                Quick start with pre-configured bundles
              </span>
            </label>
            <select
              value={selectedPreset}
              onChange={(e) => handlePresetChange(e.target.value)}
              className="w-full px-4 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white"
            >
              <option value="">Custom Configuration (current)</option>
              {presets.map((preset) => (
                <option key={preset.id} value={preset.id}>
                  {preset.name}
                </option>
              ))}
            </select>
            {selectedPreset && (
              <p className="text-xs text-gray-600 mt-2">
                {presets.find(p => p.id === selectedPreset)?.description}
              </p>
            )}
          </div>

          {/* Provider */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Provider
              <span className="ml-2 text-xs font-normal text-gray-500">
                Choose your LLM provider (Anthropic or OpenAI)
              </span>
            </label>
            <div className="flex gap-2">
              <button
                onClick={() => setConfig({ ...config, provider: 'anthropic', model: 'claude-sonnet-4-5' })}
                className={`flex-1 px-4 py-2 rounded-lg border-2 transition-colors ${
                  config.provider === 'anthropic'
                    ? 'border-blue-600 bg-blue-50 text-blue-900'
                    : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                }`}
              >
                Anthropic
              </button>
              <button
                onClick={() => setConfig({ ...config, provider: 'openai', model: 'gpt-5.2' })}
                className={`flex-1 px-4 py-2 rounded-lg border-2 transition-colors ${
                  config.provider === 'openai'
                    ? 'border-blue-600 bg-blue-50 text-blue-900'
                    : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                }`}
              >
                OpenAI
              </button>
            </div>
          </div>

          {/* API Key */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              API Key
              <span className="ml-2 text-xs font-normal text-gray-500">
                Your {config.provider === 'anthropic' ? 'Anthropic' : 'OpenAI'} API key
              </span>
            </label>
            <input
              type="password"
              value={config.apiKey}
              onChange={(e) => setConfig({ ...config, apiKey: e.target.value })}
              placeholder={config.provider === 'anthropic' ? 'sk-ant-api...' : 'sk-...'}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
            />
            {config.apiKey && (
              <p className="text-xs text-gray-500 mt-1">
                Stored as: {maskApiKey(config.apiKey)}
              </p>
            )}
          </div>

          {/* Model */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Model
              <span className="ml-2 text-xs font-normal text-gray-500">
                Select the AI model to use
              </span>
            </label>
            <select
              value={config.model}
              onChange={(e) => setConfig({ ...config, model: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
            >
              {MODEL_OPTIONS[config.provider].map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Tools */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Tools
              <span className="ml-2 text-xs font-normal text-gray-500">
                Capabilities the AI can use during conversations
              </span>
            </label>
            <div className="space-y-3">
              {Object.keys(MODULE_SOURCES.tools).map((tool) => (
                <label key={tool} className="flex items-start gap-3 cursor-pointer p-2 hover:bg-gray-50 rounded-lg transition-colors">
                  <input
                    type="checkbox"
                    checked={config.tools.includes(tool)}
                    onChange={() => toggleTool(tool)}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 mt-0.5"
                  />
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900">{tool}</div>
                    <div className="text-xs text-gray-500 mt-0.5">
                      {TOOL_DESCRIPTIONS[tool as keyof typeof TOOL_DESCRIPTIONS]}
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Session Configuration */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Orchestrator
              <span className="ml-2 text-xs font-normal text-gray-500">
                Controls how the AI processes requests
              </span>
            </label>
            <select
              value={config.orchestrator}
              onChange={(e) => setConfig({ ...config, orchestrator: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
            >
              {Object.entries(ORCHESTRATOR_DESCRIPTIONS).map(([key, description]) => (
                <option key={key} value={key}>
                  {key} - {description}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">
              {ORCHESTRATOR_DESCRIPTIONS[config.orchestrator as keyof typeof ORCHESTRATOR_DESCRIPTIONS]}
            </p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Context Manager
              <span className="ml-2 text-xs font-normal text-gray-500">
                How conversation history is stored
              </span>
            </label>
            <select
              value={config.context}
              onChange={(e) => setConfig({ ...config, context: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
            >
              {Object.entries(CONTEXT_DESCRIPTIONS).map(([key, description]) => (
                <option key={key} value={key}>
                  {key} - {description}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">
              {CONTEXT_DESCRIPTIONS[config.context as keyof typeof CONTEXT_DESCRIPTIONS]}
            </p>
          </div>

          {/* Hooks */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Hooks
              <span className="ml-2 text-xs font-normal text-gray-500">
                Optional features for enhanced functionality
              </span>
            </label>
            <div className="space-y-3">
              {Object.keys(MODULE_SOURCES.hooks).map((hook) => (
                <label key={hook} className="flex items-start gap-3 cursor-pointer p-2 hover:bg-gray-50 rounded-lg transition-colors">
                  <input
                    type="checkbox"
                    checked={config.hooks.includes(hook)}
                    onChange={() => toggleHook(hook)}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 mt-0.5"
                  />
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900">{hook}</div>
                    <div className="text-xs text-gray-500 mt-0.5">
                      {HOOK_DESCRIPTIONS[hook as keyof typeof HOOK_DESCRIPTIONS]}
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Instructions */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Custom Instructions
              <span className="ml-2 text-xs font-normal text-gray-500">
                Provide specific instructions for how the AI should behave
              </span>
            </label>
            <textarea
              value={config.instructions}
              onChange={(e) => setConfig({ ...config, instructions: e.target.value })}
              rows={8}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 font-mono text-sm"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            disabled={isSaving}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {isSaving ? 'Saving...' : 'Save & Apply'}
          </button>
        </div>
      </div>
    </>
  );
}
