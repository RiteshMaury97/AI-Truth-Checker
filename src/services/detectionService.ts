export async function analyzeVideo(file: File): Promise<{ is_deepfake: boolean; confidence: number }> {
  // Simulate a delay for the analysis
  await new Promise(resolve => setTimeout(resolve, 2000));

  // TODO: Replace with a real deepfake detection model
  // For now, we'll use the file size to make the result a bit less random
  const is_deepfake = file.size % 2 === 0;
  const confidence = Math.random();

  return { is_deepfake, confidence };
}
