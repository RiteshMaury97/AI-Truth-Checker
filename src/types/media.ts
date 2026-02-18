export type MediaType = 'image' | 'video';

export interface MediaFile {
  file: File;
  type: MediaType;
  id: string;
}

export interface AnalysisResult {
  fabricationPercentage: number;
  result: 'real' | 'fake';
  explanation: string;
}

export interface AnalysisData {
    id: string;
    fileName: string;
    mediaType: MediaType;
    analysisResult: AnalysisResult;
    timestamp: string;
}
