
import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import imageKit from '@/lib/imagekit';

export async function POST(req: Request) {
  const formData = await req.formData();
  const files = formData.getAll('files') as File[];

  if (!files || files.length === 0) {
    return NextResponse.json({ message: 'No files found' }, { status: 400 });
  }

  try {
    const uploadedFiles = [];

    for (const file of files) {
      const fileExtension = path.extname(file.name);
      const uniqueFilename = `${uuidv4()}${fileExtension}`;
      const tempFilePath = path.join('/tmp', uniqueFilename);

      // Save the file temporarily
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      await writeFile(tempFilePath, buffer);

      // Upload to ImageKit
      const imageKitResponse = await imageKit.upload({
        file: tempFilePath,
        fileName: uniqueFilename,
        folder: 'deepfake_detection',
      });

      uploadedFiles.push({
        url: imageKitResponse.url,
        name: file.name,
        type: file.type,
        size: file.size,
      });
    }

    return NextResponse.json({ files: uploadedFiles }, { status: 201 });
  } catch (error) {
    console.error('Error uploading files:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
