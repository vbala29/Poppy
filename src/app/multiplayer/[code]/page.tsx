"use client";

import GameBoard from "@/app/multiplayer/[code]/components/GameBoard/GameBoard";
import LoadingScreen from "@/app/components/LoadingScreen";
import Head from "next/head";
import { ChangeEvent, useState, useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { DefaultEventsMap } from "@socket.io/component-emitter";
import {
  GUESS_UPDATE_BODY,
  PLAYERS_BODY,
  PLAYERS_UPDATE_BODY,
  ROUND_INFO_BODY,
  SCORE_INFO_BODY,
  START_REQUEST_BODY,
  UserName,
} from "@/../socket-types";
import {
  GAME_END,
  GUESS,
  GUESS_MADE,
  GUESS_UPDATE,
  PLAYERS,
  PLAYERS_UPDATE,
  ROUND_END,
  ROUND_INFO,
  ROUND_INTERLUDE,
  ROUND_START,
  SCORE_INFO,
  START,
  START_REQUEST,
} from "@/../socket-messages";
import { MultiplayerGame } from "../../../../../../socket-types";
import { Guess, TileCount } from "@/app/components/GameBoard/GameBoard";

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
  const roundTimeSeconds = 20;
  const [timeInRound, setTimeInRound] = useState(roundTimeSeconds);
  const [openRoundEndModal, setOpenRoundEndModal] = useState(false);
  const [currentBestGuess, setCurrentBestGuess] = useState<null | [Guess, TileCount]>(null);
  const [sortedRoundResults, setSortedRoundResults] = useState<SCORE_INFO_BODY>([]);
  const [openScoreModal, setOpenScoreModal] = useState(false);
  const [currentGuess, setCurrentGuess] = useState<null | number>(null);
  const [guessUpdates, setGuessUpdates] = useState<[UserName, Guess][]>([]);
  const [gameEnd, setGameEnd] = useState(false);
  const [enterGameError, setEnterGameError] = useState("");

  let socket = useRef<Socket<DefaultEventsMap, DefaultEventsMap> | null>(null);

  function restartGame() {
    setStartModal(true);
    setGameEnd(false);
    setRoundStartModal(true);
    setParticipants({}); // Reset game info state.
    handleEnterGame(); // Sends request to rejoin game with your current name.

  }

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
        setRoundNumber(1); // Round start modal increments by one.
      });

      socket.current.on(ROUND_INTERLUDE, (roundNumber) => {
        setRoundNumber(roundNumber);
        setOpenRoundEndModal(false);
        setOpenScoreModal(false);
        setRoundStartModal(true);
      })

      socket.current.on(
        ROUND_INFO,
        (countryInfo: ROUND_INFO_BODY) => {
          setCountryInfo(countryInfo);
        }
      );

      socket.current.on(ROUND_START, () => {
        setRoundStartModal(false);
      });

      socket.current.on(SCORE_INFO, (sortedResults: SCORE_INFO_BODY) => {
        setSortedRoundResults(sortedResults);
      });

      socket.current.on(PLAYERS_UPDATE, (msg: PLAYERS_UPDATE_BODY) => {
        setParticipants(msg);
        setOpenRoundEndModal(false);
        setOpenScoreModal(true);
      });

      socket.current.on(GUESS_UPDATE, (guessInfo: GUESS_UPDATE_BODY) => {
        const [name, _]: GUESS_UPDATE_BODY = guessInfo;

        setGuessUpdates(g => [...g, guessInfo]);
        setTimeout(() => {
          let found = false;
          let newGuessUpdate = guessUpdates.filter((v) => {
            if (found) return true;

            const [guess_name, _]: GUESS_UPDATE_BODY = v;
            if (guess_name === name) {
              found = true;
              return false;
            }

            return true;
          });
          setGuessUpdates(newGuessUpdate);
        }, 2000)
      });

      socket.current.on(GAME_END, () => {
        setOpenScoreModal(false);
        setGameEnd(true);
      })
    }
  }, []);


  useEffect(() => {
    if (!openStartModal && socket.current !== null) {
      const body: START_REQUEST_BODY = params.code;
      socket.current.emit(START_REQUEST, body);
    }
  }, [openStartModal]);

  useEffect(() => {
    if (!openRoundStartModal) {
      setTimeInRound(roundTimeSeconds); // 30 Seconds per round);
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

  useEffect(() => {
    if (currentBestGuess !== null) {
      socket.current.emit(GUESS, [name, currentBestGuess]);
    }
  }, [currentBestGuess])

  useEffect(() => {
    if (currentGuess !== null) {
      socket.current.emit(GUESS_MADE, [name, currentGuess]);
    }
  }, [currentGuess])

  function rendered() {
    setGameBoardRendered(true);
  }

  function handleNameInput(e: ChangeEvent<HTMLInputElement>): void {
    setName(e.target.value);
  }

  async function handleEnterGame() {
    const MAX_NAME_LENGTH = 15;
    if (name.length > MAX_NAME_LENGTH || name.length <= 0) {
      setEnterGameError("Name must be between 1 and 15 characters long");
    } else {
      let res = await fetch("/api/multiplayer/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: params.code, name }),
      });
      if (res.status != 200) {
        setEnterGameError(await res.text());
      } else {
        setEnterGame(true);
      }
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
            setCurrentBestGuess={setCurrentBestGuess}
            setCurrentGuess={setCurrentGuess}
            openScoreModal={openScoreModal}
            sortedRoundResults={sortedRoundResults}
            guessUpdates={guessUpdates}
            gameEnd={gameEnd}
            restartGame={restartGame}
          />
        </main>
      ) : (
        <main className="min-h-screen bg-night">
          <div className="flex font-mono">
            <div className="w-1/3"></div>

            <div className="w-1/3 flex-col text-center justify-center bg-black mx-3.5 mt-10 rounded-md font-mono">
              <h1 className="text-white text-xl mt-7 mb-5 text-center">
                <b>Enter Your Name</b>
              </h1>
              <div className="flex flex-row text-center items-center justify-center mb-5">
                <form className="flex" onSubmit={(e) => { e.preventDefault(); handleEnterGame(); }}>
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
                  className="bg-blue w-1/3 text-white text-sm rounded-md h-fit py-4 mx-3 mb-6 hover:bg-night"
                  onClick={handleEnterGame}
                >
                  Join Game
                </button>
              </div>
              <div className="flex text-center text-white text-xs items-center justify-center mb-6">
                {enterGameError}
              </div>
            </div>

            <div className="w-1/3"></div>
          </div>
        </main>
      )}
    </>
  );
}
