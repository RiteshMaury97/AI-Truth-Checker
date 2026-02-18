
export type MediaType = 'image' | 'video' | 'audio';

export interface MediaFile {
  fileName: string;
  mediaType: MediaType;
  file: File;
}

export interface AnalysisResult {
  fabricationPercentage: number;
  result: 'real' | 'fake';
  explanation: string;
}

export interface ReportRecord {
  mediaFile: MediaFile;
  analysisResult: AnalysisResult;
}
