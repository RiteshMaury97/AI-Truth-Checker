
import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import imageKit from '@/lib/imagekit';

// Helper to reliably get a file extension from MIME type
const getExtensionFromMimeType = (mimeType: string): string => {
    const mimeMap: { [key: string]: string } = {
        'image/jpeg': '.jpg',
        'image/png': '.png',
        'image/gif': '.gif',
        'image/webp': '.webp',
        'video/mp4': '.mp4',
        'video/webm': '.webm',
        'video/quicktime': '.mov',
        'video/x-matroska': '.mkv',
    };
    return mimeMap[mimeType] || '';
};

export async function POST(req: Request) {
  const formData = await req.formData();
  const files = formData.getAll('files') as File[];

  if (!files || files.length === 0) {
    return NextResponse.json({ message: 'No files found' }, { status: 400 });
  }

  try {
    const uploadedFiles = [];

    for (const file of files) {
      // Determine file extension primarily from MIME type for reliability
      const fileExtension = getExtensionFromMimeType(file.type) || path.extname(file.name);
      if (!fileExtension) {
        console.warn(`Could not determine file extension for file: ${file.name}, type: ${file.type}. Skipping file.`);
        continue; // Skip files we cannot identify
      }

      const uniqueFilename = `${uuidv4()}${fileExtension}`;
      const tempFilePath = path.join('/tmp', uniqueFilename);

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      await writeFile(tempFilePath, buffer);

      // Upload to ImageKit
      const imageKitResponse = await imageKit.upload({
        file: tempFilePath,
        fileName: uniqueFilename,
        folder: 'deepfake_detection',
      });

      // Crucially, include the filePath in the response
      uploadedFiles.push({
        url: imageKitResponse.url,
        filePath: imageKitResponse.filePath, // The key to robust thumbnail generation
        name: file.name,
        type: file.type,
        size: file.size,
      });
    }

    if (uploadedFiles.length === 0 && files.length > 0) {
        return NextResponse.json({ message: 'None of the provided files could be processed.' }, { status: 400 });
    }

    return NextResponse.json({ files: uploadedFiles }, { status: 201 });
  } catch (error) {
    console.error('Error during file upload:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
