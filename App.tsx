import React, { useState, useCallback, useEffect } from 'react';
import { Header } from './components/Header';
import { UploadSection } from './components/UploadSection';
import { ProcessingView } from './components/ProcessingView';
import { ResultView } from './components/ResultView';
import { Button } from './components/Button';
import { AppStep, BreakdownResult, ProcessingState, VideoMetadata } from './types';
import { fileToGenerativePart, generateBreakdown } from './services/geminiService';
import { Wand2 } from 'lucide-react';

const App: React.FC = () => {
  const [step, setStep] = useState<AppStep>(AppStep.UPLOAD);
  const [videoMeta, setVideoMeta] = useState<VideoMetadata | null>(null);
  const [processingState, setProcessingState] = useState<ProcessingState>({ progress: 0, message: '' });
  const [result, setResult] = useState<BreakdownResult | null>(null);

  // Cleanup object URL when component unmounts or videoMeta changes
  useEffect(() => {
    return () => {
      if (videoMeta?.objectUrl) {
        URL.revokeObjectURL(videoMeta.objectUrl);
      }
    };
  }, [videoMeta]);

  const handleFileSelect = useCallback(async (file: File) => {
    setStep(AppStep.PREPARING);
    setProcessingState({ progress: 10, message: `Reading ${file.name}...` });

    try {
      // Step 1: Create local preview URL
      const objectUrl = URL.createObjectURL(file);

      // Step 2: Read file to base64
      // Note: We use inlineData for this implementation. 
      const part = await fileToGenerativePart(file);
      
      setVideoMeta({
        name: file.name,
        size: file.size,
        type: file.type,
        base64Data: part.inlineData.data,
        objectUrl: objectUrl
      });

      setProcessingState({ progress: 100, message: 'Ready to analyze' });
      setStep(AppStep.READY_TO_GENERATE);

    } catch (error) {
      console.error("Error reading file", error);
      alert("Failed to process file locally. Please try again.");
      setStep(AppStep.UPLOAD);
    }
  }, []);

  const handleGenerateClick = async () => {
    if (!videoMeta || !videoMeta.base64Data) return;

    setStep(AppStep.ANALYZING);
    setProcessingState({ progress: 0, message: 'Connecting to Gemini Vision...' });

    // Simulate progress for the "Thinking" phase
    const progressInterval = setInterval(() => {
      setProcessingState(prev => {
        if (prev.progress >= 90) return prev;
        return { 
          progress: prev.progress + (Math.random() * 5), 
          message: prev.progress > 40 ? 'analyzing visual semantics...' : 'processing frames...' 
        };
      });
    }, 800);

    try {
      const breakdown = await generateBreakdown(videoMeta.base64Data, videoMeta.type);
      clearInterval(progressInterval);
      setResult(breakdown);
      setStep(AppStep.RESULT);
    } catch (error) {
      clearInterval(progressInterval);
      console.error(error);
      alert("An error occurred during AI analysis. Please check your API key or file size.");
      setStep(AppStep.READY_TO_GENERATE);
    }
  };

  const handleReset = () => {
    if (videoMeta?.objectUrl) {
      URL.revokeObjectURL(videoMeta.objectUrl);
    }
    setVideoMeta(null);
    setResult(null);
    setProcessingState({ progress: 0, message: '' });
    setStep(AppStep.UPLOAD);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col font-sans text-slate-50 selection:bg-indigo-500/30">
      <Header />
      
      <main className="flex-1 flex flex-col items-center px-4 md:px-8 pb-12">
        
        {step === AppStep.UPLOAD && (
          <UploadSection onFileSelect={handleFileSelect} />
        )}

        {(step === AppStep.PREPARING || step === AppStep.ANALYZING) && (
          <ProcessingView step={step} state={processingState} />
        )}

        {step === AppStep.READY_TO_GENERATE && videoMeta && (
          <div className="w-full max-w-2xl mx-auto mt-12 animate-fade-in text-center">
             <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 mb-8">
                <h2 className="text-xl font-semibold text-white mb-6">Ready to Process</h2>
                
                {videoMeta.objectUrl && (
                  <div className="mb-6 rounded-xl overflow-hidden border border-slate-700 bg-black shadow-lg mx-auto max-h-64 inline-block">
                    <video 
                      src={videoMeta.objectUrl} 
                      className="max-h-64 max-w-full object-contain"
                      controls
                      playsInline
                    />
                  </div>
                )}

                <div className="flex items-center justify-center gap-4 text-slate-400 text-sm mb-8">
                  <span className="px-3 py-1 rounded-full bg-slate-800 border border-slate-700">{videoMeta.name}</span>
                  <span className="px-3 py-1 rounded-full bg-slate-800 border border-slate-700">{(videoMeta.size / (1024 * 1024)).toFixed(1)} MB</span>
                </div>
                
                <Button onClick={handleGenerateClick} className="w-full sm:w-auto text-lg px-12 py-4">
                  <Wand2 className="w-5 h-5 mr-2" />
                  Generate Breakdown Prompt
                </Button>
             </div>
             <button onClick={handleReset} className="text-sm text-slate-500 hover:text-slate-300 transition-colors">
               Cancel and upload different file
             </button>
          </div>
        )}

        {step === AppStep.RESULT && result && (
          <ResultView result={result} onReset={handleReset} videoUrl={videoMeta?.objectUrl} />
        )}

      </main>

      <footer className="w-full py-8 text-center border-t border-slate-900 bg-slate-950">
        <p className="text-slate-500 text-sm">
          Developed for AI content creators by Kashif Ali.
        </p>
      </footer>
    </div>
  );
};

export default App;