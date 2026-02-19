
export interface MediaUpload {
    _id: string;
    name: string;
    type: string;
    size: number;
    url: string;
    filePath: string; // Added from the robust upload flow
  }
  
  export interface AnalysisResult {
    confidence: number;
    explanation: string;
    isdeepfake: boolean;
    status: 'completed' | 'failed';
    createdAt: Date;
  }
  
  // This combines the original upload info with the analysis results
  export type EnrichedMediaUpload = MediaUpload & AnalysisResult;
  