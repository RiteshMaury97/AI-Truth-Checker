
import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';

export async function GET() {
  try {
    const { db } = await connectToDatabase();
    const reports = await db.collection('reports').find({}).sort({ createdAt: -1 }).toArray();
    return NextResponse.json({ reports }, { status: 200 });
  } catch (error) {
    console.error('Failed to fetch reports:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
