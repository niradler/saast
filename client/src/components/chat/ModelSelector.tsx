import { useState } from 'react';
import { ChevronDown, Zap, Brain, Sparkles, Clock } from 'lucide-react';
import { Select } from '../ui/Select';

interface Model {
  id: string;
  name: string;
  description: string;
  contextLength: number;
  speed: 'fast' | 'medium' | 'slow';
  capabilities: string[];
  pricing?: {
    input: number;
    output: number;
  };
  isNew?: boolean;
  isBeta?: boolean;
}

interface ModelSelectorProps {
  currentModel: string;
  onModelChange: (modelId: string) => void;
  disabled?: boolean;
  showDetails?: boolean;
  className?: string;
}

const AVAILABLE_MODELS: Model[] = [
  {
    id: 'gpt-4-turbo',
    name: 'GPT-4 Turbo',
    description: 'Most capable model for complex tasks',
    contextLength: 128000,
    speed: 'medium',
    capabilities: ['reasoning', 'coding', 'analysis', 'creativity'],
    pricing: { input: 0.01, output: 0.03 },
    isNew: true
  },
  {
    id: 'gpt-4',
    name: 'GPT-4',
    description: 'High-quality responses for complex tasks',
    contextLength: 8192,
    speed: 'slow',
    capabilities: ['reasoning', 'coding', 'analysis'],
    pricing: { input: 0.03, output: 0.06 }
  },
  {
    id: 'gpt-3.5-turbo',
    name: 'GPT-3.5 Turbo',
    description: 'Fast and efficient for most tasks',
    contextLength: 16385,
    speed: 'fast',
    capabilities: ['conversation', 'writing', 'coding'],
    pricing: { input: 0.0015, output: 0.002 }
  },
  {
    id: 'claude-3-opus',
    name: 'Claude 3 Opus',
    description: 'Exceptional performance on complex tasks',
    contextLength: 200000,
    speed: 'medium',
    capabilities: ['reasoning', 'analysis', 'creativity', 'coding'],
    pricing: { input: 0.015, output: 0.075 },
    isNew: true
  },
  {
    id: 'claude-3-sonnet',
    name: 'Claude 3 Sonnet',
    description: 'Balanced performance and speed',
    contextLength: 200000,
    speed: 'fast',
    capabilities: ['reasoning', 'analysis', 'writing'],
    pricing: { input: 0.003, output: 0.015 }
  },
  {
    id: 'gemini-pro',
    name: 'Gemini Pro',
    description: 'Google\'s advanced reasoning model',
    contextLength: 32000,
    speed: 'fast',
    capabilities: ['reasoning', 'coding', 'multimodal'],
    pricing: { input: 0.0005, output: 0.0015 },
    isBeta: true
  }
];

export function ModelSelector({
  currentModel,
  onModelChange,
  disabled = false,
  showDetails = true,
  className = ''
}: ModelSelectorProps) {
  const [showModelDetails, setShowModelDetails] = useState(false);
  
  const selectedModel = AVAILABLE_MODELS.find(model => model.id === currentModel);

  const getSpeedIcon = (speed: string) => {
    switch (speed) {
      case 'fast': return <Zap className="w-3 h-3 text-green-500" />;
      case 'medium': return <Clock className="w-3 h-3 text-yellow-500" />;
      case 'slow': return <Brain className="w-3 h-3 text-blue-500" />;
      default: return null;
    }
  };

  const formatContextLength = (length: number) => {
    if (length >= 1000) {
      return `${Math.floor(length / 1000)}K`;
    }
    return length.toString();
  };

  const selectOptions = AVAILABLE_MODELS.map(model => ({
    value: model.id,
    label: model.name,
    description: model.description
  }));

  return (
    <div className={`${className}`}>
      {/* Compact Selector */}
      <div className="flex items-center space-x-2">
        <Select
          options={selectOptions}
          value={currentModel}
          onChange={onModelChange}
          disabled={disabled}
          className="min-w-[200px]"
        />
        
        {showDetails && selectedModel && (
          <button
            onClick={() => setShowModelDetails(true)}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            title="Model details"
          >
            <Brain className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Selected Model Info Bar */}
      {selectedModel && (
        <div className="mt-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-1">
                {getSpeedIcon(selectedModel.speed)}
                <span className="text-xs font-medium text-gray-600 dark:text-gray-400 capitalize">
                  {selectedModel.speed}
                </span>
              </div>
              
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {formatContextLength(selectedModel.contextLength)} context
              </div>
              
              {selectedModel.isNew && (
                <span className="px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-medium rounded-full">
                  New
                </span>
              )}
              
              {selectedModel.isBeta && (
                <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs font-medium rounded-full">
                  Beta
                </span>
              )}
            </div>
            
            {selectedModel.pricing && (
              <div className="text-xs text-gray-500 dark:text-gray-400">
                ${selectedModel.pricing.input}/1K input • ${selectedModel.pricing.output}/1K output
              </div>
            )}
          </div>
        </div>
      )}

      {/* Detailed Model Comparison Modal */}
      {showModelDetails && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-2xl w-full max-w-4xl max-h-[80vh] overflow-hidden">
            {/* Header */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  Choose Model
                </h2>
                <button
                  onClick={() => setShowModelDetails(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  ✕
                </button>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Select the AI model that best fits your needs
              </p>
            </div>

            {/* Models Grid */}
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              <div className="grid gap-4 md:grid-cols-2">
                {AVAILABLE_MODELS.map((model) => (
                  <div
                    key={model.id}
                    className={`
                      p-4 border rounded-lg cursor-pointer transition-all
                      ${model.id === currentModel
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                      }
                    `}
                    onClick={() => {
                      onModelChange(model.id);
                      setShowModelDetails(false);
                    }}
                  >
                    {/* Model Header */}
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                            {model.name}
                          </h3>
                          {model.isNew && (
                            <span className="px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-medium rounded-full">
                              New
                            </span>
                          )}
                          {model.isBeta && (
                            <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs font-medium rounded-full">
                              Beta
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {model.description}
                        </p>
                      </div>
                      
                      {model.id === currentModel && (
                        <div className="w-5 h-5 bg-primary-500 rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full" />
                        </div>
                      )}
                    </div>

                    {/* Model Stats */}
                    <div className="grid grid-cols-2 gap-4 mb-3">
                      <div>
                        <div className="flex items-center space-x-1 mb-1">
                          {getSpeedIcon(model.speed)}
                          <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                            Speed
                          </span>
                        </div>
                        <div className="text-sm text-gray-900 dark:text-gray-100 capitalize">
                          {model.speed}
                        </div>
                      </div>
                      
                      <div>
                        <div className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                          Context Length
                        </div>
                        <div className="text-sm text-gray-900 dark:text-gray-100">
                          {formatContextLength(model.contextLength)} tokens
                        </div>
                      </div>
                    </div>

                    {/* Capabilities */}
                    <div className="mb-3">
                      <div className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
                        Capabilities
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {model.capabilities.map((capability) => (
                          <span
                            key={capability}
                            className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-xs text-gray-700 dark:text-gray-300 rounded-md"
                          >
                            {capability}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Pricing */}
                    {model.pricing && (
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        ${model.pricing.input}/1K input • ${model.pricing.output}/1K output
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}