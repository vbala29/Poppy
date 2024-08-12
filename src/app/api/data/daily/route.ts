import { NextResponse } from 'next/server'
import { saveDaily, readDaily, DailyInfo, connect, disconnect } from '@/lib/redis'

connect();

export async function GET(request: Request) {
    const daily = await readDaily();
    return NextResponse.json(daily);
}

export async function POST(request: Request) {
    const newDaily : DailyInfo = await request.json();
    await saveDaily(newDaily);
    return NextResponse.json(null, { status: 200 });
}