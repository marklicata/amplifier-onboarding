'use client';

import { useState, useEffect } from 'react';

interface Example {
  id: string;
  title: string;
  tier: number;
  category: string;
  description: string;
  estimatedTimeMinutes: number;
  minAudience: string;
  isFeatured: boolean;
  difficulty: string;
  tags: string[];
}

interface ExampleBrowserProps {
  onSelectExample: (exampleId: string) => void;
  selectedId?: string;
}

const tierColors = {
  1: 'bg-green-100 text-green-800',
  2: 'bg-blue-100 text-blue-800',
  3: 'bg-purple-100 text-purple-800',
  4: 'bg-orange-100 text-orange-800',
};

const difficultyIcons = {
  beginner: '🎯',
  intermediate: '🔧',
  advanced: '🚀',
};

export default function ExampleBrowser({ onSelectExample, selectedId }: ExampleBrowserProps) {
  const [examples, setExamples] = useState<Example[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [tierFilter, setTierFilter] = useState<number | null>(null);

  useEffect(() => {
    loadExamples();
  }, []);

  const loadExamples = async () => {
    try {
      const response = await fetch('/api/playground/examples');
      if (!response.ok) {
        throw new Error('Failed to load examples');
      }
      const data = await response.json();
      setExamples(data.examples || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredExamples = examples.filter(example => {
    const matchesSearch = searchQuery === '' || 
      example.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      example.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      example.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesTier = tierFilter === null || example.tier === tierFilter;
    
    return matchesSearch && matchesTier;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800">Failed to load examples: {error}</p>
        <button
          onClick={loadExamples}
          className="mt-2 text-red-600 hover:text-red-800 underline"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search and Filters */}
      <div className="space-y-2">
        <input
          type="text"
          placeholder="Search examples..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setTierFilter(null)}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              tierFilter === null
                ? 'bg-gray-800 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All Tiers
          </button>
          {[1, 2, 3, 4].map(tier => (
            <button
              key={tier}
              onClick={() => setTierFilter(tier)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                tierFilter === tier
                  ? 'bg-gray-800 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Tier {tier}
            </button>
          ))}
        </div>
      </div>

      {/* Examples List */}
      <div className="space-y-2">
        {filteredExamples.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No examples found. Try adjusting your filters.
          </div>
        ) : (
          filteredExamples.map(example => (
            <button
              key={example.id}
              onClick={() => onSelectExample(example.id)}
              className={`w-full text-left p-4 rounded-lg border transition-all ${
                selectedId === example.id
                  ? 'border-blue-500 bg-blue-50 shadow-md'
                  : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-2xl">{difficultyIcons[example.difficulty as keyof typeof difficultyIcons]}</span>
                    <h3 className="font-semibold text-gray-900 truncate">
                      {example.title}
                    </h3>
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                    {example.description}
                  </p>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${tierColors[example.tier as keyof typeof tierColors]}`}>
                      Tier {example.tier}
                    </span>
                    <span className="text-xs text-gray-500">
                      ⏱️ {example.estimatedTimeMinutes} min
                    </span>
                    {example.isFeatured && (
                      <span className="text-xs px-2 py-1 rounded-full bg-yellow-100 text-yellow-800 font-medium">
                        ⭐ Featured
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
