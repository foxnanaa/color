import React, { useState } from 'react';
import ImageUploader from './components/ImageUploader';
import ControlPanel from './components/ControlPanel';
import ResultDisplay from './components/ResultDisplay';
import { processImage } from './services/geminiService';
import { ProcessingState } from './types';

const App: React.FC = () => {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  
  const [selectedColors, setSelectedColors] = useState<string[]>(['red', 'blue']);
  const [intensity, setIntensity] = useState<number>(0.3);
  
  const [processingState, setProcessingState] = useState<ProcessingState>({
    isLoading: false,
    error: null,
    progress: ''
  });

  const handleImageSelect = (base64: string) => {
    setOriginalImage(base64);
    setProcessedImage(null);
    setProcessingState({ isLoading: false, error: null, progress: '' });
  };

  const handleColorToggle = (colorVal: string) => {
    setSelectedColors(prev => {
      if (prev.includes(colorVal)) {
        return prev.filter(c => c !== colorVal);
      } else {
        return [...prev, colorVal];
      }
    });
  };

  const handleProcess = async () => {
    if (!originalImage) return;

    setProcessingState({
      isLoading: true,
      error: null,
      progress: 'Analyzing crystals and applying colors...'
    });

    try {
      const result = await processImage(originalImage, selectedColors, intensity);
      setProcessedImage(result);
      setProcessingState({
        isLoading: false,
        error: null,
        progress: 'Done'
      });
    } catch (err: any) {
      setProcessingState({
        isLoading: false,
        error: err.message || "An unexpected error occurred",
        progress: ''
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-blue-500/30">
      
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
             <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
             </div>
             <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
               Crystal Colorizer AI
             </h1>
          </div>
          <div className="text-xs text-slate-500 font-medium px-3 py-1 bg-slate-900 rounded-full border border-slate-800">
             Powered by Gemini 2.5
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Controls & Upload */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Upload Section */}
            {!originalImage ? (
                <ImageUploader onImageSelected={handleImageSelect} />
            ) : (
                <div className="bg-slate-800/30 border border-slate-700 rounded-2xl p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                         <div className="h-12 w-12 rounded-lg bg-slate-800 overflow-hidden border border-slate-600">
                             <img src={originalImage} alt="Thumbnail" className="h-full w-full object-cover" />
                         </div>
                         <div>
                             <p className="text-sm font-medium text-slate-200">Image Loaded</p>
                             <button 
                               onClick={() => { setOriginalImage(null); setProcessedImage(null); }}
                               className="text-xs text-red-400 hover:text-red-300 transition-colors"
                             >
                                Remove & Upload New
                             </button>
                         </div>
                    </div>
                </div>
            )}

            {/* Controls */}
            <ControlPanel 
              selectedColors={selectedColors}
              onColorToggle={handleColorToggle}
              intensity={intensity}
              setIntensity={setIntensity}
              onProcess={handleProcess}
              isProcessing={processingState.isLoading}
              hasImage={!!originalImage}
            />

            {/* Error Message */}
            {processingState.error && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-400 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <div className="text-sm text-red-200">
                  <p className="font-semibold">Generation Failed</p>
                  <p>{processingState.error}</p>
                </div>
              </div>
            )}

            {/* Instructions / Info */}
            <div className="bg-slate-800/20 rounded-xl p-5 border border-slate-800">
                <h4 className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">How it works</h4>
                <ul className="text-sm text-slate-500 space-y-2 list-disc pl-4">
                    <li>Upload an SEM micrograph or crystal image.</li>
                    <li>Select colors to highlight specific regions.</li>
                    <li>Adjust density to control how many crystals are colored.</li>
                    <li>Gemini AI will segment and colorize naturally.</li>
                </ul>
            </div>
          </div>

          {/* Right Column: Visualization */}
          <div className="lg:col-span-8 min-h-[500px]">
             {originalImage ? (
                 <ResultDisplay originalImage={originalImage} processedImage={processedImage} />
             ) : (
                 <div className="h-full w-full rounded-2xl border-2 border-dashed border-slate-800 bg-slate-900/20 flex flex-col items-center justify-center p-12 text-center text-slate-600">
                    <div className="w-20 h-20 rounded-full bg-slate-800/50 mb-4 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <p className="text-lg font-medium">No Image Loaded</p>
                    <p className="text-sm max-w-sm mt-2">The workspace is empty. Upload an image from the left panel to begin colorizing crystals.</p>
                 </div>
             )}
          </div>

        </div>
      </main>
    </div>
  );
};

export default App;
