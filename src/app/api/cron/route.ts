import { NextResponse } from 'next/server'
import updateDaily from "@/lib/cron/facts"

export async function GET(request: Request) {
    let retry_count = 10;
    while(retry_count--) {
        try {
            const statusCode: number = await updateDaily();
            return NextResponse.json(null, { status: statusCode });
        } catch (error) {
            console.log("Update daily failed, retrying...", error);
        }
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
}