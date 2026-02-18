import { ObjectId } from 'mongodb';

export type MediaType = 'image' | 'video' | 'audio';

export interface MediaFile {
  file: File;
  type: MediaType;
  id: string;
}

export interface MediaUpload {
    _id?: ObjectId;
    fileName: string;
    mediaType: MediaType;
    imagekitUrl: string;
    imagekitFileId?: string;
    uploadDate: Date;
    createdAt: Date;
    analysisReportId?: ObjectId;
}

export interface AnalysisReport {
    _id?: ObjectId;
    mediaUploadId: ObjectId;
    fileName: string;
    mediaType: MediaType;
    imagekitUrl: string;
    fabricationPercentage: number;
    authenticityPercentage: number;
    resultStatus: 'real' | 'fake';
    explanation: string;
    scores: Record<string, number>;
    analyzedDate: Date;
    createdAt: Date;
}

export interface EnrichedMediaUpload extends MediaUpload {
    analysisResult: AnalysisReport;
}
