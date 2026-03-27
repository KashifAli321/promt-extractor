import React, { useCallback, useState } from 'react';
import { UploadCloud, FileVideo, AlertCircle } from 'lucide-react';
import { MAX_FILE_SIZE_BYTES, MAX_FILE_SIZE_MB, ALLOWED_TYPES } from '../constants';

interface UploadSectionProps {
  onFileSelect: (file: File) => void;
}

export const UploadSection: React.FC<UploadSectionProps> = ({ onFileSelect }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateFile = (file: File): boolean => {
    if (!ALLOWED_TYPES.includes(file.type) && !file.name.endsWith('.mkv')) {
      setError("Invalid file type. Please upload .mp4 or .mkv");
      return false;
    }
    if (file.size > MAX_FILE_SIZE_BYTES) {
      setError(`File too large. Maximum size is ${MAX_FILE_SIZE_MB}MB`);
      return false;
    }
    return true;
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    setError(null);

    const file = e.dataTransfer.files[0];
    if (file && validateFile(file)) {
      onFileSelect(file);
    }
  }, [onFileSelect]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const file = e.target.files?.[0];
    if (file && validateFile(file)) {
      onFileSelect(file);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto mt-12 animate-fade-in-up">
      <div 
        className={`
          relative group cursor-pointer
          border-2 border-dashed rounded-3xl p-12
          transition-all duration-300 ease-in-out
          flex flex-col items-center justify-center text-center
          ${isDragging 
            ? 'border-indigo-500 bg-indigo-500/10 scale-[1.02]' 
            : 'border-slate-700 bg-slate-900/50 hover:border-slate-500 hover:bg-slate-800/50'
          }
          ${error ? 'border-red-500/50 bg-red-500/5' : ''}
        `}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => document.getElementById('fileInput')?.click()}
      >
        <input 
          type="file" 
          id="fileInput" 
          className="hidden" 
          accept=".mp4,.mkv"
          onChange={handleFileInput}
        />
        
        <div className={`
          p-5 rounded-2xl mb-6 transition-transform duration-300
          ${isDragging ? 'scale-110 bg-indigo-500 text-white' : 'bg-slate-800 text-indigo-400'}
        `}>
          {isDragging ? <UploadCloud className="w-10 h-10" /> : <FileVideo className="w-10 h-10" />}
        </div>

        <h3 className="text-xl font-semibold text-white mb-2">
          Upload Video File
        </h3>
        <p className="text-slate-400 mb-6 max-w-xs mx-auto">
          Drag & drop or click to upload<br/>
          <span className="text-slate-500 text-sm">MP4 or MKV up to {MAX_FILE_SIZE_MB}MB</span>
        </p>

        {error && (
          <div className="absolute bottom-4 left-0 right-0 mx-auto w-max flex items-center gap-2 text-red-400 bg-red-950/50 px-4 py-2 rounded-full text-sm border border-red-900/50">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        )}
      </div>
    </div>
  );
};