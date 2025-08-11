import { useState } from "react";

interface Parameter {
  type: string;
  min?: number;
  max?: number;
  default: any;
  options?: string[];
  value?: any;
}

interface ParametersPanelProps {
  parameters: Record<string, Parameter>;
  onParameterChange: (paramName: string, value: any) => void;
  onPlay: () => void;
  onPause: () => void;
  onReset: () => void;
  isPlaying: boolean;
}

export default function ParametersPanel({ 
  parameters, 
  onParameterChange, 
  onPlay, 
  onPause, 
  onReset, 
  isPlaying 
}: ParametersPanelProps) {
  const [speedMultiplier, setSpeedMultiplier] = useState(1);
  const [timelineValue, setTimelineValue] = useState(0);
  const [backgroundType, setBackgroundType] = useState('transparent');

  const formatLabel = (key: string) => {
    return key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1');
  };

  const handleSpeedChange = (value: number) => {
    setSpeedMultiplier(value);
    onParameterChange('speedMultiplier', value);
  };

  const handleBackgroundChange = (type: string) => {
    setBackgroundType(type);
    const canvas = document.getElementById('effectCanvas') as HTMLCanvasElement;
    if (canvas) {
      switch (type) {
        case 'transparent':
          canvas.style.background = 'transparent';
          break;
        case 'black':
          canvas.style.background = '#000000';
          break;
        case 'white':
          canvas.style.background = '#ffffff';
          break;
        case 'custom':
          // TODO: Implement custom color picker
          break;
      }
    }
  };

  return (
    <div className="panel h-full flex flex-col">
      <div className="panel-header">
        <h3 className="text-lg font-rajdhani font-bold text-primary flex items-center gap-2">
          <i className="fas fa-sliders-h"></i> Parameters
        </h3>
      </div>
      
      <div className="p-5 flex-1 overflow-y-auto">
        {/* Control Buttons */}
        <div className="flex gap-2 mb-5">
          <button 
            className={`control-btn ${!isPlaying ? 'opacity-100' : 'opacity-50'}`}
            onClick={onPlay}
            disabled={isPlaying}
            data-testid="button-play"
          >
            <i className="fas fa-play"></i>
          </button>
          <button 
            className={`control-btn ${isPlaying ? 'opacity-100' : 'opacity-50'}`}
            onClick={onPause}
            disabled={!isPlaying}
            data-testid="button-pause"
          >
            <i className="fas fa-pause"></i>
          </button>
          <button 
            className="control-btn"
            onClick={onReset}
            data-testid="button-reset"
          >
            <i className="fas fa-redo"></i>
          </button>
          <button 
            className="control-btn"
            data-testid="button-loop"
          >
            <i className="fas fa-sync"></i>
          </button>
        </div>

        {/* Timeline */}
        <div className="mb-5">
          <label className="text-sm text-foreground mb-2 block">Timeline</label>
          <input 
            type="range" 
            className="parameter-slider w-full"
            min="0" 
            max="100" 
            value={timelineValue}
            onChange={(e) => setTimelineValue(Number(e.target.value))}
            data-testid="slider-timeline"
          />
        </div>

        {/* Speed Control */}
        <div className="mb-5">
          <label className="text-sm text-foreground mb-2 block">
            Speed Multiplier: <span className="text-primary font-semibold" data-testid="text-speed-value">{speedMultiplier.toFixed(1)}x</span>
          </label>
          <input 
            type="range" 
            className="parameter-slider w-full"
            min="0.1" 
            max="5" 
            step="0.1" 
            value={speedMultiplier}
            onChange={(e) => handleSpeedChange(Number(e.target.value))}
            data-testid="slider-speed"
          />
        </div>

        {/* Dynamic Parameters */}
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-primary mb-3">Effect Parameters</h4>
          <div className="space-y-4">
            {Object.entries(parameters).map(([key, param]) => {
              if (param.type === 'range') {
                const currentValue = param.value ?? param.default;
                return (
                  <div key={key} className="space-y-2">
                    <label className="text-sm text-foreground block">
                      {formatLabel(key)}: <span className="text-primary font-semibold" data-testid={`text-${key}-value`}>
                        {Number(currentValue).toFixed(2)}
                      </span>
                    </label>
                    <input 
                      type="range" 
                      className="parameter-slider w-full"
                      min={param.min} 
                      max={param.max} 
                      step="0.01" 
                      value={currentValue}
                      onChange={(e) => onParameterChange(key, Number(e.target.value))}
                      data-testid={`slider-${key}`}
                    />
                  </div>
                );
              } else if (param.type === 'select') {
                return (
                  <div key={key} className="space-y-2">
                    <label className="text-sm text-foreground block">{formatLabel(key)}</label>
                    <select 
                      className="w-full bg-input border border-border text-foreground px-3 py-2 rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                      value={param.value ?? param.default}
                      onChange={(e) => onParameterChange(key, e.target.value)}
                      data-testid={`select-${key}`}
                    >
                      {param.options?.map(option => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  </div>
                );
              }
              return null;
            })}
          </div>
        </div>

        {/* Background Options */}
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-primary mb-3">Background</h4>
          <div className="grid grid-cols-2 gap-2">
            {['transparent', 'black', 'white', 'custom'].map((type) => (
              <button
                key={type}
                className={`control-btn text-xs ${backgroundType === type ? 'opacity-100' : 'opacity-70'}`}
                onClick={() => handleBackgroundChange(type)}
                data-testid={`button-bg-${type}`}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Quality Settings */}
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-primary mb-3">Quality</h4>
          <div className="grid grid-cols-3 gap-2">
            {['Draft', 'Preview', 'Final'].map((quality) => (
              <button
                key={quality}
                className="control-btn text-xs"
                data-testid={`button-quality-${quality.toLowerCase()}`}
              >
                {quality}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
