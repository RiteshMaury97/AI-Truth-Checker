
import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { connectToDatabase } from '@/lib/mongodb';
import ffprobe from 'ffprobe-static';
import { exec } from 'child_process';
import { promisify } from 'util';
import exifParser from 'exif-parser';

const execAsync = promisify(exec);

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

async function analyzeImage(fileUrl: string, fileBuffer: Buffer) {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro-vision' });
    const prompt = `Perform a deep forensic analysis of the provided image. Your analysis must include:
1.  **Error Level Analysis (ELA):** Identify areas with different compression levels.
2.  **Noise Consistency Check:** Look for inconsistencies in the noise pattern.
3.  **Compression Artifacts:** Detect unusual JPEG artifacts or blocking.
4.  **Face Anomaly Detection:** If faces are present, check for unnatural features, inconsistent lighting, or strange blending.

Based on your analysis, provide a \`visualAuthenticityScore\` from 0 to 100, where 100 is completely authentic. Return a single JSON object with the score and a brief explanation.

Example:
{
  \"visualAuthenticityScore\": 15,
  \"explanation\": \"The image shows significant JPEG artifacts around the subject\\\'s head, and the noise pattern is inconsistent with the rest of the image. ELA reveals a high variance in compression levels.\"\n}`;

    const imagePart = { inlineData: { data: Buffer.from(fileBuffer).toString('base64'), mimeType: 'image/jpeg' } };
    const result = await model.generateContent([prompt, imagePart]);
    const text = result.response.text();
    const match = text.match(/{[\s\S]*}/);
    if (!match) throw new Error("Invalid response from AI model");
    return JSON.parse(match[0]);
}

async function analyzeVideo(fileUrl: string) {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const prompt = `Analyze the provided video\\\'s metadata and characteristics. Your analysis must cover:
1.  **Keyframe Analysis:** (Conceptual) Describe what you would look for in keyframes to detect manipulation.
2.  **Temporal Consistency:** Are there any jumps, glitches, or unnatural transitions?
3.  **Lip-Sync Consistency:** If a person is speaking, does the audio sync with their lip movements?

Provide a \`videoAuthenticityScore\` from 0 to 100, where 100 is completely authentic. Return a single JSON object.

Example:
{
  \"videoAuthenticityScore\": 25,
  \"explanation\": \"The video shows several temporal inconsistencies, including a noticeable jump-cut at 0:15. The speaker\\\'s lip-sync is also slightly off during the second half of the video.\"\n}`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const match = text.match(/{[\s\S]*}/);
    if (!match) throw new Error("Invalid response from AI model");
    return JSON.parse(match[0]);
}

async function analyzeAudio(fileUrl: string) {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const prompt = `Perform a forensic analysis of this audio file. Your analysis should include:
1.  **Spectrogram Consistency:** Are there unusual patterns or artifacts in the spectrogram?
2.  **Voice Naturalness:** Does the voice sound natural? Check for robotic tones, flat intonation, or unnatural breathing.
3.  **Anti-Spoofing:** (Conceptual) Describe what anti-spoofing models would look for to detect a synthesized voice.

Provide an \`audioAuthenticityScore\` from 0 to 100. Return a single JSON object.

Example:
{
  \"audioAuthenticityScore\": 30,
  \"explanation\": \"The spectrogram shows an unnatural frequency cutoff above 15kHz, and the speaker\\\'s intonation is unusually flat throughout the recording. These are common signs of a synthesized voice.\"\n}`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const match = text.match(/{[\s\S]*}/);
    if (!match) throw new Error("Invalid response from AI model");
    return JSON.parse(match[0]);
}

async function analyzeMetadata(fileUrl: string, fileBuffer: Buffer) {
    let metadataOutput = '';
    try {
        if (fileUrl.match(/\.(jpeg|jpg|tiff)$/i)) {
            const parser = exifParser.create(fileBuffer);
            const result = parser.parse();
            metadataOutput = JSON.stringify(result, null, 2);
        } else {
            const { stdout } = await execAsync(`${ffprobe.path} -v quiet -print_format json -show_format -show_streams \"${fileUrl}\"`);
            metadataOutput = stdout;
        }
    } catch (error) {
        console.error('Error extracting metadata:', error);
        metadataOutput = 'Could not extract metadata.';
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const prompt = `You are a digital forensics expert. Analyze the following metadata and provide a score from 0-100 for its authenticity, where 100 is completely authentic. Look for missing fields, signs of editing software, or inconsistencies. Provide the score in a JSON object: { \"metadataAuthenticityScore\": number }. Metadata: ${metadataOutput}`;

    try {
        const result = await model.generateContent(prompt);
        const text = result.response.text();
        const jsonMatch = text.match(/{[\s\S]*}/);
        if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch[0]);
            return { metadataAuthenticityScore: parsed.metadataAuthenticityScore || 0 };
        }
        return { metadataAuthenticityScore: 0 };
    } catch (error) {
        console.error("Error analyzing metadata with Gemini", error);
        return { metadataAuthenticityScore: 0 };
    }
}

async function generateExplanation(analysisResult: any) {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const prompt = `
        You are a senior digital forensics analyst delivering a final report.
        Based on the following structured analysis data, generate a human-readable explanation and actionable verification tips.

        **Analysis Data:**
        - Authenticity Status: ${analysisResult.authenticityStatus}
        - Final Authenticity Score: ${analysisResult.authenticity.toFixed(2)}%
        - Media Type: ${analysisResult.type}
        ${analysisResult.visualAuthenticityScore ? `- Visual Authenticity Score: ${analysisResult.visualAuthenticityScore}%` : ''}
        ${analysisResult.videoAuthenticityScore ? `- Video Authenticity Score: ${analysisResult.videoAuthenticityScore}%` : ''}
        ${analysisResult.audioAuthenticityScore ? `- Audio Authenticity Score: ${analysisResult.audioAuthenticityScore}%` : ''}
        - Metadata Authenticity Score: ${analysisResult.metadataAuthenticityScore}%

        **Your Task:**
        1.  **Generate a comprehensive, easy-to-understand explanation.** Synthesize the data above to explain *why* the file received its authenticity status.
        2.  **Provide a list of concrete, actionable verification steps.**

        **Return a single, clean JSON object with the following structure and nothing else:**
        {
          "explanation": "A string containing your detailed explanation.",
          "verificationTips": ["A string array of tips."]
        }
    `;

    try {
        const result = await model.generateContent(prompt);
        const text = result.response.text();
        const jsonMatch = text.match(/{[\s\S]*}/);
        if (jsonMatch) {
            return JSON.parse(jsonMatch[0]);
        }
        return {
            explanation: "Could not generate a detailed explanation.",
            verificationTips: []
        };
    } catch (error) {
        console.error("Error generating final explanation with Gemini", error);
        return {
            explanation: "An error occurred while generating the final explanation.",
            verificationTips: []
        };
    }
}

export async function POST(req: Request) {
    console.log('Received POST request to /api/detect');
    let files;
    try {
        const body = await req.json();
        files = body.files;
    } catch (error) {
        console.error('Error parsing request body:', error);
        return NextResponse.json({ message: 'Invalid JSON in request' }, { status: 400 });
    }

    if (!files || !Array.isArray(files)) {
        console.log('Invalid request format, files not found.');
        return NextResponse.json({ message: 'Invalid request' }, { status: 400 });
    }

    console.log(`Processing ${files.length} files.`);

    try {
        const { db } = await connectToDatabase();
        const clientReports = [];

        for (const file of files) {
            try {
                // Create MediaUpload Document
                const mediaUpload = {
                    fileName: file.name,
                    mediaType: file.type,
                    imagekitUrl: file.url,
                    uploadDate: new Date(),
                    createdAt: new Date(),
                };
                const mediaUploadResult = await db.collection('mediaUploads').insertOne(mediaUpload);
                const mediaUploadId = mediaUploadResult.insertedId;

                // Perform Analysis
                let analysisResult: any = { type: file.type };
                const response = await fetch(file.url);
                const fileBuffer = await response.arrayBuffer();
                const metadata = await analyzeMetadata(file.url, Buffer.from(fileBuffer));
                analysisResult = { ...analysisResult, ...metadata };

                let authenticity = 0;
                if (file.type.startsWith('image')) {
                    const imageAnalysis = await analyzeImage(file.url, Buffer.from(fileBuffer));
                    analysisResult = { ...analysisResult, ...imageAnalysis };
                    authenticity = (analysisResult.visualAuthenticityScore * 0.7) + (analysisResult.metadataAuthenticityScore * 0.3);
                } else if (file.type.startsWith('video')) {
                    const videoAnalysis = await analyzeVideo(file.url);
                    const audioAnalysis = await analyzeAudio(file.url);
                    analysisResult = { ...analysisResult, ...videoAnalysis, ...audioAnalysis };
                    authenticity = (analysisResult.videoAuthenticityScore * 0.6) + (analysisResult.audioAuthenticityScore * 0.2) + (analysisResult.metadataAuthenticityScore * 0.2);
                } else if (file.type.startsWith('audio')) {
                    const audioAnalysis = await analyzeAudio(file.url);
                    analysisResult = { ...analysisResult, ...audioAnalysis };
                    authenticity = (analysisResult.audioAuthenticityScore * 0.8) + (analysisResult.metadataAuthenticityScore * 0.2);
                }

                analysisResult.authenticity = Math.max(0, Math.min(100, authenticity));

                if (analysisResult.authenticity >= 70) {
                    analysisResult.authenticityStatus = 'Likely Authentic';
                } else if (analysisResult.authenticity >= 40) {
                    analysisResult.authenticityStatus = 'Suspicious';
                } else {
                    analysisResult.authenticityStatus = 'Likely AI Generated / Fabricated';
                }

                const explanationLayer = await generateExplanation(analysisResult);

                // Create AnalysisReport Document
                const analysisReport = {
                    mediaUploadId: mediaUploadId,
                    fileName: file.name,
                    mediaType: file.type,
                    imagekitUrl: file.url,
                    authenticityPercentage: parseFloat(analysisResult.authenticity.toFixed(2)),
                    authenticityStatus: analysisResult.authenticityStatus,
                    metadataScore: analysisResult.metadataAuthenticityScore,
                    visualScore: analysisResult.visualAuthenticityScore ?? null,
                    audioScore: analysisResult.audioAuthenticityScore ?? null,
                    explanation: explanationLayer.explanation,
                    verificationTips: explanationLayer.verificationTips,
                    analyzedDate: new Date(),
                    createdAt: new Date(),
                };

                const analysisReportResult = await db.collection('analysisReports').insertOne(analysisReport);
                const reportId = analysisReportResult.insertedId;

                // Link Report to Upload
                await db.collection('mediaUploads').updateOne(
                    { _id: mediaUploadId },
                    { $set: { analysisReportId: reportId } }
                );
                
                clientReports.push(analysisReport);

            } catch (error) {
                console.error(`Failed to analyze file: ${file.url}`, error);
                clientReports.push({ fileName: file.name, error: error.message });
            }
        }

        return NextResponse.json({ reports: clientReports }, { status: 201 });

    } catch (error) {
        console.error('Error processing analysis request:', error);
        return NextResponse.json({ message: error.message, stack: error.stack }, { status: 500 });
    }
}
