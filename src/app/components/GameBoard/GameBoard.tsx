"use client";

import QuizGlobe from "@/app/components/QuizGlobe";
import GuessBoard from "@/app/components/GameBoard/GuessBoard/GuessBoard";
import { FaPlay, FaMoneyCheckDollar } from "react-icons/fa6";
import { RiLandscapeLine } from "react-icons/ri";
import { GiLifeBar } from "react-icons/gi";
import { useState, useEffect, FormEvent, ChangeEvent } from "react";
import { DailyFact } from "@/lib/redis";
import { Coordinate } from "@/lib/cron/facts"
import Modal from "@/app/components/GameBoard/Modal/Modal";
import { GUESSES_ALLOWED } from "@/app/components/GameBoard/GuessBoard/GuessBoard";

type Props = {
  rendered: () => void;
}

export const MAX_TILE_COUNT = 5;
const TILE_COUNT_SCALER = 3.4;

function isNonNegativeInteger(value: string): boolean {
  return /^\d+$/.test(value);
}

export default function GameBoard({ rendered }: Props) {
  const [guessInfo, setGuessInfo] = useState<[number, number][]>([]);
  const [country, setCountry] = useState("null");
  const [facts, setFacts] = useState<DailyFact | null>(null);
  const [population, setPopulation] = useState(0);
  const [guessedPopulation, setGuessedPopulation] = useState("");
  const [countryCoordinates, setCountryCoordinates] = useState<Coordinate>({ lat: 0, lon: 0 })
  const [gameOver, setGameOver] = useState(false);

  // Route to request today's country
  useEffect(() => {
    fetch("/api/data/daily")
      .then((res) => res.json())
      .then((data) => {
        setCountry(data.country);
        setPopulation(data.population);
        setFacts(data.facts);
        setCountryCoordinates({ lat: data.lat, lon: data.lon })
      });
  }, []);

  useEffect(() => {
    if (guessInfo.length >= GUESSES_ALLOWED) {
      setGameOver(true);
      return;
    }
  }, [guessInfo])

  function handlePopulationInput (e: ChangeEvent<HTMLInputElement>): void {
    setGuessedPopulation(e.target.value);
  };

  function calculateTileCount(guess: number): number {
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

  function submitGuess (e: FormEvent<HTMLFormElement>): void {
    const MAX_GUESS_VALUE = 1000000000; // 1 billion
    e.preventDefault();
    if (gameOver) return;

    if (guessInfo.length >= GUESSES_ALLOWED) {
      return;
    }

    let parsedGuess = guessedPopulation.replace(/,/g, '');
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
  };

  return (
    <div className="z-50">
    <Modal gameOver={gameOver} clientAnswer={guessInfo.length > 0 ? guessInfo[guessInfo.length - 1][0] : 0} actualAnswer={population} answerTileCount={guessInfo.length > 0 ? guessInfo[guessInfo.length - 1][1] : 0} guessInfo={guessInfo} />
    <div className="z-0">
      <div className="bg-night flex font-mono">

        <div className="bg-night mx-10 my-10 w-full h-96 rounded-lg">
          <div className="flex flex-col mx-3 my-1">
            <h2 className="flex text-center mx-3.5 my-5 items-center justify-center bg-white rounded-md text-black h-12">
              Country: {country}
            </h2>

            <form className="flex mx-3.5" onSubmit={submitGuess}>
              <input
                type="numeric"
                placeholder="Enter population..."
                value={guessedPopulation}
                onChange={handlePopulationInput}
                className="bg-white outline outline-1 outline-grey text-grey rounded-md px-3 py-2 my-0.5"
              />
              <button
                type="submit"
                className="bg-black text-white rounded-md px-4 py-2 h-12 ml-3 my-0.5 hover:bg-blue"
              >
                Guess
              </button>
            </form>
            <div className="my-4 mx-3">
              <GuessBoard guessInfo={guessInfo} gameOver={gameOver} />
            </div>
          </div>
        </div>

        <div className="">
          <QuizGlobe
            shadedCountry={country}
            endCoordinates={countryCoordinates}
            rendered={rendered}
          />
        </div>

        <div className="bg-night mx-10 my-10 w-full h-96 rounded-lg">
          <div className="flex flex-col mx-3 my-1">
            <h2 className="flex text-center mx-2 mt-5 mb-2 items-center justify-center bg-white rounded-md text-black h-12">
              The Facts
            </h2>
            <div className="flex flex-col text-white p-4 font-mono">
              <div className="flex space-x-3 items-center mb-7">
                <FaMoneyCheckDollar style={{ color: "white" }} size={45} />
                <span>
                  GDP
                  <br />
                  ${
                    (facts !== null) ? (facts.gdp * 1000000).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : 'N/A'
                  }
                </span>
              </div>

              <div className="flex space-x-3 items-center mb-7">
                <RiLandscapeLine style={{ color: "white" }} size={45} />
                <span>
                  Total Area
                  <br />
                  {
                    (facts !== null) ? facts.area.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : 'N/A'
                  } km<sup>2</sup>

                </span>
              </div>

              <div className="flex space-x-3 items-center mb-7">
                <GiLifeBar style={{ color: "white" }} size={45} />
                <span>
                  Life Expectancy
                  <br />
                  {
                    (facts !== null) ? facts.lifeExpectancy : 'N/A'
                  } Years
                </span>
              </div>
            </div>

          </div>
        </div>


      </div>
      </div>
      </div>
  );
}
