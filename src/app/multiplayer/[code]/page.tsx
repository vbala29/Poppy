"use client";

import GameBoard from "@/app/components/GameBoard/GameBoard";
import LoadingScreen from "@/app/components/LoadingScreen";
import Head from "next/head";
import { ChangeEvent, useState } from "react";

type Params = {
  params: {
    code: string;
  };
};

export default function Home({
  params,
}: {
  params: { code: string };
}) {

  const [name, setName] = useState("");
  const [enterGame, setEnterGame] = useState(false);
  const [gameBoardRendered, setGameBoardRendered] = useState(false);

  function rendered() {
    setGameBoardRendered(true);
  }

  function handleNameInput(e: ChangeEvent<HTMLInputElement>): void {
    if (e.target.value.length <= 20) {
      setName(e.target.value);
    }
  }

  async function handleEnterGame(): Promise<void> {
    if (e.target.value.length > 0) {
      setEnterGame(true);
      await fetch("/api/multiplayer/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: params.code, name }),
      });
    }
  }

  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0"
        ></meta>
      </Head>
      {enterGame ? (
        <main className="bg-black">
          <LoadingScreen display={!gameBoardRendered} />
          <GameBoard rendered={rendered} ready={gameBoardRendered} />
        </main>
      ) : (
        <main className="min-h-screen bg-night">
          <div className="flex font-mono">
            <div className="w-1/3"></div>

            <div className="w-1/3 flex-col text-center justify-center bg-white mx-3.5 mt-10 rounded-md font-mono">
              <h1 className="text-black text-xl mt-7 mb-5 text-center">
                <b>Enter </b>
              </h1>
              <div className="flex flex-row text-center items-center justify-center mb-5">
                <form className="flex">
                  <input
                    type="text"
                    placeholder="Enter Name"
                    value={name}
                    onChange={handleNameInput}
                    className="bg-white outline outline-1 outline-grey h-fit text-grey rounded-md px-3 py-4 my-1"
                    style={{ minWidth: 0 }}
                  />
                </form>
              </div>
              <div className="flex text-center items-center justify-center">
                <button
                  className="bg-blue w-1/3 text-white text-sm rounded-md h-fit py-4 mx-3 mb-6 hover:bg-black"
                  onClick={handleEnterGame}
                >
                  Join Game
                </button>
              </div>
            </div>

            <div className="w-1/3"></div>
          </div>
        </main>
      )}
    </>
  );
}
