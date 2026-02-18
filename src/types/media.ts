export type MediaType = 'image' | 'video' | 'audio';

export interface MediaFile {
  file: File;
  type: MediaType;
  id: string;
}

export interface AnalysisResult {
  fabricationPercentage: number;
  result: 'real' | 'fake';
  explanation: string;
  scores: Record<string, number>;
}

export interface MediaUpload {
    fileName: string;
    mediaType: MediaType;
    imagekitUrl: string;
    imagekitFileId?: string;
    analysisResult: AnalysisResult;
    uploadDate: Date;
    createdAt: Date;
}
