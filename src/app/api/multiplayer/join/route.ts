import { connect, createNewGame, joinGame } from "@/lib/redis";
import { NextResponse } from "next/server";

connect();

export async function POST(request: Request) {
    const [code, name]: [string, string] = await request.json().then(data => [data.code, data.name]);
    await joinGame(code, name);
    return NextResponse.json({ code: code }, { status: 200 });
}