
import { AnalysisResult } from '@/types/media';

// Mock analysis function
const performMockAnalysis = (file: File): AnalysisResult => {
  // Simulate a delay to mimic a real analysis process
  const delay = Math.random() * 2000 + 500; // 500ms to 2.5s
  //while (new Date().getTime() < new Date().getTime() + delay) {}

  const isDeepfake = Math.random() < 0.5;
  const fabricationPercentage = isDeepfake ? Math.random() * 50 + 50 : Math.random() * 20;

  return {
    fabricationPercentage,
    result: isDeepfake ? 'fake' : 'real',
    explanation: isDeepfake
      ? 'The analysis suggests a high probability of digital manipulation. This is based on inconsistencies in lighting, shadows, and subtle artifacts in the media.'
      : 'The analysis indicates that the media is likely authentic. No significant signs of digital manipulation were detected.',
  };
};

export const analyzeVideo = async (file: File): Promise<AnalysisResult> => {
  console.log(`Analyzing file: ${file.name}`);
  return performMockAnalysis(file);
};
