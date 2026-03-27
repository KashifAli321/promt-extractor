import React, { useEffect, useState } from 'react';
import { Loader2, Zap } from 'lucide-react';
import { AppStep, ProcessingState } from '../types';

interface ProcessingViewProps {
  step: AppStep;
  state: ProcessingState;
}

export const ProcessingView: React.FC<ProcessingViewProps> = ({ step, state }) => {
  const [visualProgress, setVisualProgress] = useState(0);

  // Smooth progress bar animation
  useEffect(() => {
    if (state.progress > visualProgress) {
      const diff = state.progress - visualProgress;
      const stepSize = Math.max(diff / 20, 0.5); // Minimal step
      const timer = setTimeout(() => {
        setVisualProgress(prev => Math.min(prev + stepSize, 100));
      }, 20);
      return () => clearTimeout(timer);
    }
  }, [state.progress, visualProgress]);

  return (
    <div className="w-full max-w-2xl mx-auto mt-12 p-8 md:p-12 rounded-3xl bg-slate-900/50 border border-slate-800 text-center animate-fade-in">
      <div className="relative w-24 h-24 mx-auto mb-8">
        <div className="absolute inset-0 bg-indigo-500/20 rounded-full animate-pulse-slow"></div>
        <div className="absolute inset-0 flex items-center justify-center">
           {step === AppStep.ANALYZING ? (
             <Zap className="w-10 h-10 text-indigo-400 animate-pulse" />
           ) : (
             <Loader2 className="w-10 h-10 text-indigo-400 animate-spin" />
           )}
        </div>
        {/* Animated ring */}
        <svg className="absolute inset-0 w-full h-full rotate-[-90deg]" viewBox="0 0 100 100">
          <circle 
            cx="50" cy="50" r="46" 
            fill="none" 
            stroke="#1e293b" 
            strokeWidth="4" 
          />
          <circle 
            cx="50" cy="50" r="46" 
            fill="none" 
            stroke="#6366f1" 
            strokeWidth="4" 
            strokeDasharray="289.026" // 2 * pi * 46
            strokeDashoffset={289.026 * (1 - visualProgress / 100)}
            strokeLinecap="round"
            className="transition-all duration-300 ease-out"
          />
        </svg>
      </div>

      <h2 className="text-2xl font-bold text-white mb-2">
        {step === AppStep.ANALYZING ? "AI Analyzing Footage" : "Processing Upload"}
      </h2>
      <p className="text-slate-400 mb-8 h-6">
        {state.message}
      </p>

      {/* Waveform Animation Simulation */}
      <div className="h-12 flex items-center justify-center gap-1 mb-6 opacity-70">
        {[...Array(12)].map((_, i) => (
          <div 
            key={i}
            className="w-1.5 bg-indigo-500 rounded-full animate-pulse"
            style={{ 
              height: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.1}s`,
              animationDuration: '0.8s'
            }}
          />
        ))}
      </div>
      
      <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold">
        {step === AppStep.ANALYZING ? "Extracting Visual Semantics" : "Preparing Video Buffer"}
      </p>
    </div>
  );
};