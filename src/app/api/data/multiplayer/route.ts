import { chooseMultiplayerCountry } from "@/lib/cron/facts";
import { DailyInfo } from "@/lib/redis";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const previouslySelected: string[] = await request.json();
    let retry_count = 10;
    while(retry_count--) {
        try {
            const info : DailyInfo = await chooseMultiplayerCountry(previouslySelected);
            return NextResponse.json(info);
        } catch (error) {
            console.log("/api/data/multiplayer choosing country failed, retrying..." + error);
        }
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
}