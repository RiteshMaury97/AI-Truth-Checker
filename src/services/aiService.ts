
import { MediaFile, AnalysisResult } from '@/types/media';

export const analyzeMedia = async (mediaFile: MediaFile): Promise<AnalysisResult> => {
  const formData = new FormData();
  formData.append('file', mediaFile.file);

  const response = await fetch('/api/detect', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Failed to analyze media');
  }

  const result = await response.json();

  return {
    fabricationPercentage: result.fabricationPercentage || 0,
    result: result.result || 'real',
    explanation: result.explanation || 'No explanation provided.',
  };
};
