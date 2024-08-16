import { connect, createNewGame } from "@/lib/redis";
import { NextResponse } from "next/server";

connect();

function generateGameCode(length: number = 8): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

export async function POST(request: Request) {
    const gameCode: string = generateGameCode();
    while(!await createNewGame(gameCode)) {};
    return NextResponse.json({ code: gameCode }, { status: 200 });
}