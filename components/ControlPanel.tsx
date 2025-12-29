import React from 'react';
import { ColorOption, DEFAULT_COLORS } from '../types';

interface ControlPanelProps {
  selectedColors: string[];
  onColorToggle: (colorVal: string) => void;
  intensity: number;
  setIntensity: (val: number) => void;
  onProcess: () => void;
  isProcessing: boolean;
  hasImage: boolean;
}

const ControlPanel: React.FC<ControlPanelProps> = ({
  selectedColors,
  onColorToggle,
  intensity,
  setIntensity,
  onProcess,
  isProcessing,
  hasImage
}) => {
  return (
    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-6 flex flex-col gap-6">
      
      {/* Color Selection */}
      <div>
        <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-3">
          Target Colors
        </h3>
        <div className="flex flex-wrap gap-3">
          {DEFAULT_COLORS.map((color) => {
            const isSelected = selectedColors.includes(color.value);
            return (
              <button
                key={color.id}
                onClick={() => onColorToggle(color.value)}
                className={`
                  flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all
                  ${isSelected 
                    ? 'bg-slate-700 ring-2 ring-offset-2 ring-offset-slate-900 ring-blue-500 text-white' 
                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200'}
                `}
              >
                <span 
                  className="w-3 h-3 rounded-full shadow-sm" 
                  style={{ backgroundColor: color.colorCode }}
                />
                {color.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Intensity Slider */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">
            Colorization Density
          </h3>
          <span className="text-xs text-slate-400 bg-slate-800 px-2 py-1 rounded">
            {Math.round(intensity * 100)}%
          </span>
        </div>
        <input
          type="range"
          min="0.1"
          max="0.9"
          step="0.1"
          value={intensity}
          onChange={(e) => setIntensity(parseFloat(e.target.value))}
          className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
        />
        <div className="flex justify-between text-xs text-slate-500 mt-2">
          <span>Subtle</span>
          <span>Balanced</span>
          <span>Heavy</span>
        </div>
      </div>

      {/* Action Button */}
      <button
        onClick={onProcess}
        disabled={!hasImage || isProcessing || selectedColors.length === 0}
        className={`
          w-full py-3.5 px-6 rounded-xl font-bold text-white shadow-lg transition-all transform
          ${!hasImage || isProcessing || selectedColors.length === 0
            ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
            : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 hover:scale-[1.02] active:scale-[0.98] shadow-blue-500/25'}
        `}
      >
        {isProcessing ? (
          <div className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing Crystals...
          </div>
        ) : (
          "Generate Colorized Image"
        )}
      </button>

      {!hasImage && (
        <p className="text-center text-xs text-slate-500">
          Upload an image to start
        </p>
      )}
    </div>
  );
};

export default ControlPanel;
