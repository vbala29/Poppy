"use client";

import QuizGlobe from "@/app/components/QuizGlobe";
import GuessBoard from "@/app/multiplayer/[code]/components/GameBoard/GuessBoard/GuessBoard";
import { FaPlay, FaMoneyCheckDollar } from "react-icons/fa6";
import { RiLandscapeLine } from "react-icons/ri";
import { GiLifeBar } from "react-icons/gi";
import { useState, useEffect, FormEvent, ChangeEvent } from "react";
import { DailyFact, DailyInfo } from "@/lib/redis";
import { Coordinate } from "@/lib/cron/facts";
import Modal from "@/app/multiplayer/[code]/components/GameBoard/Modal/Modal";
import { GUESSES_ALLOWED } from "@/app/multiplayer/[code]/components/GameBoard/GuessBoard/GuessBoard";
import {
  MultiplayerGame,
  MultiplayerUser,
  SCORE_INFO_BODY,
} from "../../../../../../socket-types";

export type TileCount = number;
export type Guess = number;

type Props = {
  rendered: () => void;
  ready: boolean;
  participants: MultiplayerGame;
  openStartModal: boolean;
  setStartModal: (arg0: boolean) => void;
  openRoundStartModal: boolean;
  roundNumber: number;
  countryInfo: DailyInfo;
  openRoundEndModal: boolean;
  timeInRound: number;
  setCurrentBestGuess: (arg0: [Guess, TileCount]) => void;
  openScoreModal: boolean;
  sortedRoundResults: SCORE_INFO_BODY;
};

export const MAX_TILE_COUNT = 5;
const TILE_COUNT_SCALER = 3.4;

function isNonNegativeInteger(value: string): boolean {
  return /^\d+$/.test(value);
}

export default function GameBoard({
  rendered,
  ready,
  participants,
  openStartModal,
  setStartModal,
  openRoundStartModal,
  roundNumber,
  countryInfo,
  openRoundEndModal,
  timeInRound,
  setCurrentBestGuess,
  openScoreModal,
  sortedRoundResults
}: Props) {
  const [guessInfo, setGuessInfo] = useState<[Guess, TileCount][]>([]);
  const [country, setCountry] = useState("null");
  const [facts, setFacts] = useState<DailyFact | null>(null);
  const [population, setPopulation] = useState(0);
  const [guessedPopulation, setGuessedPopulation] = useState("");
  const [countryCoordinates, setCountryCoordinates] = useState<Coordinate>({
    lat: 0,
    lon: 0,
  });
  const [gameOver, setGameOver] = useState(false);

  // Route to request today's country
  useEffect(() => {
    setCountry(countryInfo.country);
    setPopulation(countryInfo.population);
    setFacts(countryInfo.facts);
    setCountryCoordinates({ lat: countryInfo.lat, lon: countryInfo.lon });
  }, [countryInfo]);

  useEffect(() => {
    if (guessInfo.length >= GUESSES_ALLOWED) {
      setGameOver(true);
      return;
    }

    let guess: Guess = getBestGuessAnswer();
    let tileCount: TileCount = calculateTileCount(guess);
    setCurrentBestGuess([guess, tileCount]);
  }, [guessInfo]);

  function handlePopulationInput(e: ChangeEvent<HTMLInputElement>): void {
    setGuessedPopulation(e.target.value);
  }

  function calculateTileCount(guess: Guess): TileCount {
    let scaledPop = Math.log(population) / Math.log(TILE_COUNT_SCALER);

    let intervals: number[] = [];
    for (let i = 0; i < MAX_TILE_COUNT; i++) {
      intervals.push(Math.pow(TILE_COUNT_SCALER, scaledPop - i));
    }

    let tileCount = 0;

    for (const i of intervals) {
      if (guess > population - i && guess < population + i) {
        tileCount++;
      }
    }

    return tileCount;
  }

  function submitGuess(e: FormEvent<HTMLFormElement>): void {
    const MAX_GUESS_VALUE = 1000000000; // 1 billion
    e.preventDefault();
    if (gameOver) return;

    if (guessInfo.length >= GUESSES_ALLOWED) {
      return;
    }

    let parsedGuess = guessedPopulation.replace(/,/g, "");
    if (isNonNegativeInteger(parsedGuess)) {
      let guessNum = Number(parsedGuess);
      let tileCount = calculateTileCount(guessNum);

      if (guessNum <= MAX_GUESS_VALUE) {
        setGuessInfo((g) => [...g, [guessNum, tileCount]]);
      }

      if (tileCount === MAX_TILE_COUNT) {
        setGameOver(true);
      }
    }
  }

  function getBestGuessAnswer() {
    let bestGuess = 0;
    let bestGuessDifference = Number.MAX_VALUE;
    for (let [guess, _] of guessInfo) {
      if (Math.abs(population - guess) < bestGuessDifference) {
        bestGuess = guess;
        bestGuessDifference = Math.abs(population - guess);
      }
    }

    return bestGuess;
  }

  function getBestTileCount() {
    let bestTileCount = 0;
    for (let [_, tileCount] of guessInfo) {
      if (tileCount > bestTileCount) {
        bestTileCount = tileCount;
      }
    }

    return bestTileCount;
  }

  // State updates from socket.io
  let participants_jsx = () => {
    let output = [];
    for (const user in participants) {
      const points: number = participants[user].points;
      output.push(
        <tr key={user} className="mb-1.5">
          <td>{`${user}: `}</td>
          <td>{`${points}`}</td>
        </tr>
      );
    }

    return output;
  };

  return (
    <>
      <div className="z-40">
        <Modal
          gameOver={gameOver}
          clientAnswer={guessInfo.length > 0 ? getBestGuessAnswer() : 0}
          actualAnswer={population}
          answerTileCount={guessInfo.length > 0 ? getBestTileCount() : 0}
          guessInfo={guessInfo}
          openStartModal={openStartModal}
          setStartModal={setStartModal}
          openRoundStartModal={openRoundStartModal}
          roundNumber={roundNumber}
          openRoundEndModal={openRoundEndModal}
          openScoreModal={openScoreModal}
          participants={participants}
          sortedRoundResults={sortedRoundResults}
          countryInfo={countryInfo}
        />
        <div className="z-0">
          <div className="bg-night flex flex-col items-center justify-center md:justify-normal md:items-start md:flex-row font-mono">
            {ready && (
              <div className="" style={{ width: "27%" }}>
                <div className="bg-night mx-5 my-10 h-fit rounded-lg">
                  <div className="flex flex-col mx-3 my-1">
                    <h2 className="flex text-center mx-3.5 my-5 items-center justify-center bg-white rounded-md text-black h-fit py-3.5">
                      Country: {country}
                    </h2>

                    <form
                      className="flex mx-3.5 items-center text-sm"
                      onSubmit={submitGuess}
                    >
                      <input
                        type="numeric"
                        placeholder="Enter population"
                        value={guessedPopulation}
                        onChange={handlePopulationInput}
                        className="bg-white outline outline-1 outline-grey h-fit w-2/3 text-grey rounded-md px-3 py-4 my-0.5"
                        style={{ minWidth: 0 }}
                      />
                      <button
                        type="submit"
                        className="bg-black text-white rounded-md px-4 h-fit w-1/3 py-3.5 ml-3 my-0.5 hover:bg-blue"
                      >
                        Guess
                      </button>
                    </form>
                    <div className="my-4 mx-3">
                      <GuessBoard guessInfo={guessInfo} gameOver={gameOver} />
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div
              className="flex items-center justify-center"
              style={{ width: "46%" }}
            >
              <QuizGlobe
                shadedCountry={country}
                endCoordinates={countryCoordinates}
                rendered={rendered}
              />
            </div>

            {ready && (
              <div className="" style={{ width: "27%" }}>
                <div className="bg-night mx-5 my-10 h-fit rounded-lg">
                  <div className="flex flex-col mx-3 my-1">
                    <h2 className=" text-center mx-3.5 mt-5 mb-2 items-center justify-center bg-white rounded-md text-black h-fit py-3.5">
                      The Facts
                    </h2>
                    <div className="flex flex-col text-white pt-4 px-4 font-mono">
                      <div className="flex space-x-3 items-center mb-7">
                        <FaMoneyCheckDollar
                          style={{ color: "white" }}
                          size={45}
                        />
                        <span>
                          GDP
                          <br />$
                          {facts !== null
                            ? (facts.gdp * 1000000)
                                .toString()
                                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                            : "N/A"}
                        </span>
                      </div>

                      <div className="flex space-x-3 items-center mb-7">
                        <RiLandscapeLine style={{ color: "white" }} size={45} />
                        <span>
                          Total Area
                          <br />
                          {facts !== null
                            ? facts.area
                                .toString()
                                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                            : "N/A"}{" "}
                          km<sup>2</sup>
                        </span>
                      </div>

                      <div className="flex space-x-3 items-center mb-7">
                        <GiLifeBar style={{ color: "white" }} size={45} />
                        <span>
                          Life Expectancy
                          <br />
                          {facts !== null ? facts.lifeExpectancy : "N/A"} Years
                        </span>
                      </div>
                    </div>
                    <h2 className="text-center mx-3.5 items-center justify-center bg-white rounded-md text-black h-fit py-2">
                      Players
                    </h2>
                    <div className="flex flex-col text-white pt-4 px-4 font-mono">
                      <div className="flex mb-2 space-x-4 items-center font-semibold justify-center text-center">
                        <div className="w-1/2 bg-blue text-black rounded-md">Round {roundNumber}</div>
                        <div className="w-1/2 bg-blue text-black rounded-md">{timeInRound}s remain</div>
                      </div>
                      <div className="flex flex-col mb-7">
                        <table>
                          <tbody>{participants_jsx()}</tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
