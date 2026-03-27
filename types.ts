export enum AppStep {
  UPLOAD = 'UPLOAD',
  PREPARING = 'PREPARING', // Reading file, validating
  READY_TO_GENERATE = 'READY_TO_GENERATE', // File loaded, waiting for user click
  ANALYZING = 'ANALYZING', // Sending to Gemini
  RESULT = 'RESULT',
}

export interface VideoMetadata {
  name: string;
  size: number;
  type: string;
  base64Data?: string;
  objectUrl?: string;
}

export interface BreakdownResult {
  title: string;
  prompt: string;
}

export interface ProcessingState {
  progress: number;
  message: string;
}