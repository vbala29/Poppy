import { chooseMultiplayerCountry } from "@/lib/cron/facts";
import { DailyInfo } from "@/lib/redis";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const previouslySelected: string[] = await request.json();
    while(true) {
        try {
            const info : DailyInfo = await chooseMultiplayerCountry(previouslySelected);
            return NextResponse.json(info);
        } catch (error) {
            console.log("/api/data/multiplayer choosing country failed, retrying...");
        }
    }
}