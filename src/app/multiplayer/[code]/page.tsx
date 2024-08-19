"use client";

import GameBoard from "@/app/multiplayer/[code]/components/GameBoard/GameBoard";
import LoadingScreen from "@/app/components/LoadingScreen";
import Head from "next/head";
import { ChangeEvent, useState, useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { DefaultEventsMap } from "@socket.io/component-emitter";
import {
  PLAYERS_BODY,
  ROUND_INFO_BODY,
  START_REQUEST_BODY,
} from "@/../socket-types";
import {
  PLAYERS,
  ROUND_END,
  ROUND_INFO,
  ROUND_START,
  START,
  START_REQUEST,
} from "@/../socket-messages";
import { MultiplayerGame } from "../../../../../../socket-types";

type Params = {
  params: {
    code: string;
  };
};

export default function Home({ params }: { params: { code: string } }) {
  const [name, setName] = useState("");
  const [enterGame, setEnterGame] = useState(false);
  const [gameBoardRendered, setGameBoardRendered] = useState(false);

  // Multiplayer related states
  const [participants, setParticipants] = useState<MultiplayerGame>({});
  const [openStartModal, setStartModal] = useState(true);
  const [openRoundStartModal, setRoundStartModal] = useState(true);
  const [roundNumber, setRoundNumber] = useState(1);
  const [countryInfo, setCountryInfo] = useState({
    country: "Loading",
    population: 0,
    lat: 0,
    lon: 0,
    facts: {
      gdp: 0,
      area: 0,
      lifeExpectancy: 0,
    },
  });
  const [timeInRound, setTimeInRound] = useState(30);
  const [openRoundEndModal, setOpenRoundEndModal] = useState(false);


  let socket = useRef<Socket<DefaultEventsMap, DefaultEventsMap> | null>(null);

  // We don't want this useEffect to run on name entrance page because it causes input handler to not run and input
  // to not be registered. Thus we set enterGame as the dependency
  useEffect(() => {
    if (socket.current == null) {
      socket.current = io(`http://${process.env.NEXT_PUBLIC_SITE_URL}`, {
        query: {
          code: params.code, // Used for socket.io rooms
        },
      });

      socket.current.on("connect", () => {
        console.log(`Client-side connection to Socket: ${socket.current.id}`);
      });

      socket.current.on("disconnect", () => {
        console.log(`Client-side disconnection from Socket`);
      });

      socket.current.on(PLAYERS, (msg: PLAYERS_BODY) => {
        setParticipants(msg);
      });

      socket.current.on(START, () => {
        setStartModal(false);
        setRoundNumber(1);
      });

      socket.current.on(
        ROUND_INFO,
        ({ countryInfo, roundNumber }: ROUND_INFO_BODY) => {
          setCountryInfo(countryInfo);
          setRoundNumber(roundNumber);
        }
      );

      socket.current.on(ROUND_START, () => {
        setRoundStartModal(false);
      })
    }
  }, []);
  

  useEffect(() => {
    if (!openStartModal && socket.current !== null) {
      const body: START_REQUEST_BODY = params.code;
      socket.current.emit(START_REQUEST, body);
    }
  }, [openStartModal]);

  const roundTimeSeconds = 30; // 30 Seconds per round
  useEffect(() => {
    if (!openRoundStartModal) {
      setTimeInRound(30);
      // Round has begun, let's start timer.
      const timerInterval = setInterval(() => {
        setTimeInRound((prev) => {
          if (prev === 0) {
            clearInterval(timerInterval);
            setOpenRoundEndModal(true);
            socket.current.emit(ROUND_END, "");
            return 0;
          } else {
            return prev - 1;
          }
        })
      }, 1000);
    }
  }, [openRoundStartModal])

  function rendered() {
    setGameBoardRendered(true);
  }

  function handleNameInput(e: ChangeEvent<HTMLInputElement>): void {
    setName(e.target.value);
  }

  async function handleEnterGame(): Promise<void> {
    await fetch("/api/multiplayer/join", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: params.code, name }),
    });
    setEnterGame(true);
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
          <GameBoard
            rendered={rendered}
            ready={gameBoardRendered}
            participants={participants}
            openStartModal={openStartModal}
            setStartModal={setStartModal}
            openRoundStartModal={openRoundStartModal}
            roundNumber={roundNumber}
            countryInfo={countryInfo}
            openRoundEndModal={openRoundEndModal}
            timeInRound={timeInRound}
          />
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
