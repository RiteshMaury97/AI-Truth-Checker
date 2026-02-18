
import { MediaFile, AnalysisResult } from '@/types/media';
import { analyzeVideo } from './detectionService';

export const analyzeMedia = async (mediaFile: MediaFile): Promise<AnalysisResult> => {
  const result = await analyzeVideo(mediaFile.file);
  return result;
};
