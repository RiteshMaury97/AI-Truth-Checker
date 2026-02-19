
import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

export async function GET(req: Request) {
    try {
        const { db } = await connectToDatabase();
        const reports = await db.collection('analysisReports').find({}).sort({ createdAt: -1 }).toArray();
        return NextResponse.json(reports);
    } catch (error) {
        return NextResponse.json({ message: 'Error fetching reports' }, { status: 500 });
    }
}
