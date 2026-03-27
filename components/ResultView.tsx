import React, { useState } from 'react';
import { Copy, Check, RefreshCcw, Sparkles } from 'lucide-react';
import { BreakdownResult } from '../types';
import { Button } from './Button';

interface ResultViewProps {
  result: BreakdownResult;
  onReset: () => void;
  videoUrl?: string;
}

export const ResultView: React.FC<ResultViewProps> = ({ result, onReset, videoUrl }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const fullText = `Title: ${result.title}\n\nPrompt:\n${result.prompt}`;
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-4xl mx-auto mt-8 animate-fade-in-up pb-12">
      
      {/* Header Badge */}
      <div className="flex justify-center mb-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-900/30 border border-indigo-500/30 text-indigo-300 text-sm font-medium">
          <Sparkles className="w-4 h-4" />
          <span>Analysis Complete</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        
        {/* Main Result Card */}
        <div className="bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden shadow-2xl shadow-black/50">
          
          {/* Toolbar */}
          <div className="flex items-center justify-between px-6 py-4 bg-slate-950/50 border-b border-slate-800">
            <h3 className="text-slate-200 font-medium">Generated Breakdown</h3>
            <button 
              onClick={handleCopy}
              className="flex items-center gap-2 text-sm font-medium text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? "Copied" : "Copy Prompt"}
            </button>
          </div>

          <div className="p-8">
            <div className="flex flex-col md:flex-row gap-8 mb-8">
              {/* Thumbnail Section */}
              {videoUrl && (
                <div className="w-full md:w-1/3 flex-shrink-0">
                  <div className="rounded-xl overflow-hidden border border-slate-700 bg-black aspect-video shadow-lg">
                    <video 
                      src={videoUrl} 
                      className="w-full h-full object-contain"
                      controls
                    />
                  </div>
                </div>
              )}

              {/* Title Section */}
              <div className="flex-1">
                <span className="text-xs uppercase tracking-wider text-slate-500 font-bold">Generated Title</span>
                <h2 className="text-2xl font-bold text-white mt-2 leading-tight">{result.title}</h2>
                <p className="mt-4 text-slate-400 text-sm">
                  This title is generated based on the visual and thematic analysis of your video content.
                </p>
              </div>
            </div>
            
            <div className="relative">
              <span className="text-xs uppercase tracking-wider text-slate-500 font-bold absolute -top-2 left-4 bg-slate-900 px-2">Recreation Prompt</span>
              <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 text-slate-300 leading-relaxed font-light text-lg">
                {result.prompt}
              </div>
            </div>
          </div>
        </div>

        {/* Action Footer */}
        <div className="flex justify-center mt-4">
          <Button 
            variant="secondary" 
            onClick={onReset}
            className="flex items-center gap-2"
          >
            <RefreshCcw className="w-4 h-4" />
            Start New Session
          </Button>
        </div>

      </div>
    </div>
  );
};