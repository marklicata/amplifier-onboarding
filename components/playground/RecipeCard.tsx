'use client';

import { Recipe } from '@/lib/types/recipe';

interface RecipeCardProps {
  recipe: Recipe;
  isSelected: boolean;
  onSelect: () => void;
}

export default function RecipeCard({ recipe, isSelected, onSelect }: RecipeCardProps) {
  return (
    <button
      onClick={onSelect}
      className={`w-full text-left p-4 rounded-lg border-2 border-dashed transition-all ${
        isSelected
          ? 'border-purple-500 bg-gradient-to-br from-purple-500 to-indigo-600 shadow-lg'
          : 'border-purple-300 bg-purple-50 hover:border-purple-500 hover:bg-purple-100 hover:shadow-md'
      }`}
      data-track-context="recipe-card"
      data-track-label={`recipe-${recipe.id}`}
    >
      <div className="flex items-start gap-3">
        <div className="text-3xl">{recipe.icon}</div>
        <div className="flex-1 min-w-0">
          <h4 className={`font-bold mb-1 ${
            isSelected ? 'text-white' : 'text-gray-900'
          }`}>
            {recipe.name}
          </h4>
          
          {/* Recipe Badge */}
          <div className={`inline-block px-2 py-1 rounded text-xs font-semibold mb-2 ${
            isSelected 
              ? 'bg-white bg-opacity-20 text-white border border-white border-opacity-30' 
              : 'bg-purple-100 text-purple-800 border border-purple-300'
          }`}>
            RECIPE • {recipe.steps} steps • {recipe.bundles.length} bundles
          </div>

          <p className={`text-xs mb-2 ${
            isSelected ? 'text-white text-opacity-90' : 'text-gray-600'
          }`}>
            {recipe.description.substring(0, 80)}...
          </p>

          {/* Bundle icons used */}
          <div className={`flex items-center gap-1 mb-2 text-sm ${
            isSelected ? 'text-white text-opacity-90' : 'text-gray-700'
          }`}>
            <span className="text-xs">Bundles:</span>
            {recipe.bundles.map((bundle, idx) => (
              <span key={idx} title={bundle.name}>{bundle.icon}</span>
            ))}
          </div>

          {/* Time estimate and tier */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`text-xs ${
              isSelected ? 'text-white text-opacity-80' : 'text-gray-500'
            }`}>
              ⏱️ ~{recipe.estimatedTimeMinutes} min
            </span>
            <div className={`inline-block px-2 py-1 rounded text-xs font-medium ${
              isSelected 
                ? 'bg-white bg-opacity-20 text-white' 
                : 'bg-gray-100 text-gray-700'
            }`}>
              {recipe.tier}
            </div>
          </div>
        </div>
      </div>
    </button>
  );
}
