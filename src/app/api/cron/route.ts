import { NextResponse } from 'next/server'
import updateDaily from "@/lib/cron/facts"

export async function GET(request: Request) {
    const statusCode: number = await updateDaily();
    return NextResponse.json(null, { status: statusCode });
}