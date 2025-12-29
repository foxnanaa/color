import React, { useState } from 'react';

interface ResultDisplayProps {
  originalImage: string;
  processedImage: string | null;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ originalImage, processedImage }) => {
  const [activeTab, setActiveTab] = useState<'original' | 'processed' | 'split'>('split');

  return (
    <div className="flex flex-col h-full bg-slate-800/30 rounded-2xl border border-slate-700 overflow-hidden">
      
      {/* Tab Controls */}
      <div className="flex border-b border-slate-700 bg-slate-900/50 backdrop-blur">
        <button
          onClick={() => setActiveTab('original')}
          className={`flex-1 py-3 text-sm font-medium transition-colors ${activeTab === 'original' ? 'text-blue-400 bg-slate-800/50' : 'text-slate-400 hover:text-slate-200'}`}
        >
          Original
        </button>
        {processedImage && (
           <>
            <button
              onClick={() => setActiveTab('split')}
              className={`flex-1 py-3 text-sm font-medium transition-colors ${activeTab === 'split' ? 'text-blue-400 bg-slate-800/50' : 'text-slate-400 hover:text-slate-200'}`}
            >
              Comparison
            </button>
            <button
              onClick={() => setActiveTab('processed')}
              className={`flex-1 py-3 text-sm font-medium transition-colors ${activeTab === 'processed' ? 'text-blue-400 bg-slate-800/50' : 'text-slate-400 hover:text-slate-200'}`}
            >
              Result
            </button>
           </>
        )}
      </div>

      {/* Image View */}
      <div className="relative flex-1 bg-black/40 min-h-[400px] flex items-center justify-center p-4 overflow-hidden group">
        
        {/* Checkered background for transparency */}
        <div className="absolute inset-0 z-0 opacity-20" 
             style={{ backgroundImage: 'linear-gradient(45deg, #333 25%, transparent 25%), linear-gradient(-45deg, #333 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #333 75%), linear-gradient(-45deg, transparent 75%, #333 75%)', backgroundSize: '20px 20px', backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px' }} 
        />

        <div className="relative z-10 max-h-full max-w-full flex items-center justify-center">
            {activeTab === 'original' && (
                <img src={originalImage} alt="Original" className="max-h-[60vh] object-contain rounded-lg shadow-2xl" />
            )}

            {activeTab === 'processed' && processedImage && (
                <img src={processedImage} alt="Processed" className="max-h-[60vh] object-contain rounded-lg shadow-2xl" />
            )}

            {activeTab === 'split' && processedImage && (
                <div className="relative w-full max-h-[60vh] flex justify-center">
                   <img src={originalImage} alt="Original Ref" className="max-h-[60vh] object-contain opacity-0" /> {/* Spacer */}
                   <div className="absolute inset-0 flex items-center justify-center">
                       <div className="relative max-h-[60vh] w-auto h-auto group-hover:cursor-col-resize">
                           <img src={originalImage} alt="Back" className="max-h-[60vh] object-contain rounded-lg" />
                           <div className="absolute inset-0 w-1/2 overflow-hidden border-r-2 border-white/50 shadow-[5px_0_20px_rgba(0,0,0,0.5)] transition-all duration-300 ease-out hover:w-full">
                               <img src={processedImage} alt="Front" className="max-h-[60vh] max-w-none h-full object-contain" />
                           </div>
                           <div className="absolute top-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded backdrop-blur-md">Hover to Compare</div>
                       </div>
                   </div>
                </div>
            )}
        </div>
      </div>

      {/* Download Action */}
      {processedImage && activeTab !== 'original' && (
        <div className="p-4 border-t border-slate-700 bg-slate-900/50 flex justify-end">
            <a 
              href={processedImage} 
              download="crystal-colorized.png"
              className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm font-medium transition-colors"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download Image
            </a>
        </div>
      )}
    </div>
  );
};

export default ResultDisplay;
