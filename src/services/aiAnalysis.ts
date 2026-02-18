import { OpenAI } from 'openai';
import { AnalysisResult, MediaType } from '@/types/media';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function analyzeMediaWithAI(
  mediaUrl: string,
  mediaType: MediaType
): Promise<AnalysisResult> {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY is not set');
  }

  const prompt = `
    Analyze the ${mediaType} at the following URL: ${mediaUrl}.

    Determine if the ${mediaType} is real or fabricated.

    Provide the following in a JSON format:
    - "fabricationPercentage": A number between 0 and 1 representing the likelihood of fabrication.
    - "result": Either "real" or "fake".
    - "explanation": A detailed explanation of your analysis.
    - "scores": A JSON object with scores for different fabrication aspects (e.g., manipulation, CGI, deepfake).
  `;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' },
    });

    const analysis = JSON.parse(response.choices[0].message.content || '{}');

    return {
      fabricationPercentage: analysis.fabricationPercentage || 0,
      result: analysis.result || 'real',
      explanation: analysis.explanation || 'No explanation provided.',
      scores: analysis.scores || {},
    };
  } catch (error) {
    console.error('Error analyzing media with AI:', error);
    throw new Error('Failed to analyze media with AI.');
  }
}
