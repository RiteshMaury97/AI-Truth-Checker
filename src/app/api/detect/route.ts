import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get('file');

  if (!file) {
    return NextResponse.json({ error: 'No file found' }, { status: 400 });
  }

  // TODO: Integrate a real deepfake detection model here
  const is_deepfake = Math.random() > 0.5;
  const confidence = Math.random();

  return NextResponse.json({ is_deepfake, confidence });
}
