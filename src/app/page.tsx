'use client'

import Head from "next/head";
import GameBoard from "@/app/components/GameBoard/GameBoard";
import LoadingScreen from "@/app/components/LoadingScreen";
import { useState } from "react";

export default function Home() {
  const [gameBoardRendered, setGameBoardRendered] = useState(false);

  function rendered() {
    setGameBoardRendered(true);
  }

  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0"
        ></meta>
      </Head>

      <main className="min-h-screen bg-black">
      <LoadingScreen display={!gameBoardRendered} />
      <GameBoard rendered={rendered} ready={gameBoardRendered} />
      </main>
    </>
  );
}
