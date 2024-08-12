import { NextResponse } from 'next/server'
import { saveDaily, readDaily, dailyInfo, connect } from '@/lib/redis'

connect();

export async function GET(request: Request) {
    const daily = await readDaily();

    return NextResponse.json(daily);
}

export async function POST(request: Request) {
    const newDaily : dailyInfo = await request.json();
    console.log(newDaily);
    await saveDaily(newDaily);

    return NextResponse.json(null, { status: 200 });
}