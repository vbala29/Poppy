"use client";

import QuizGlobe from "@/app/components/QuizGlobe";
import GuessBoard from "@/app/components/GameBoard/GuessBoard/GuessBoard";
import { FaPlay, FaMoneyCheckDollar } from "react-icons/fa6";
import { RiLandscapeLine } from "react-icons/ri";
import { GiLifeBar } from "react-icons/gi";
import { useState, useEffect, FormEvent, ChangeEvent } from "react";
import { DailyFact } from "@/lib/redis";
import { Coordinate } from "@/lib/cron/facts"

function isNonNegativeInteger(value: string): boolean {
  return /^\d+$/.test(value);
}

export default function GameBoard() {
  const [guessInfo, setGuessInfo] = useState<[number, number][]>([]);
  const [country, setCountry] = useState("null");
  const [facts, setFacts] = useState<DailyFact | null>(null);
  const [population, setPopulation] = useState(0);
  const [guessedPopulation, setGuessedPopulation] = useState("");
  const [countryCoordinates, setCountryCoordinates] = useState<Coordinate>({ lat: 0, lon: 0})

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

  const handlePopulationInput = (e: ChangeEvent<HTMLInputElement>): void => {
    setGuessedPopulation(e.target.value);
  };

  const submitGuess = (e: FormEvent<HTMLFormElement>): void => {
    const MAX_GUESS_VALUE = 1000000000; // 1 billion
    e.preventDefault();
    let parsedGuess = guessedPopulation.replace(/,/g, '');
    if (isNonNegativeInteger(parsedGuess)) {
      if (Number(parsedGuess) <= MAX_GUESS_VALUE) {
        setGuessInfo((g) => [...g, [Number(parsedGuess), 3]]);
      }
    }
  };

  return (
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
            <GuessBoard guessInfo={guessInfo} />
          </div>
        </div>
      </div>

      <div className="">
        <QuizGlobe
          shadedCountry={country}
          endCoordinates={countryCoordinates}
          playGame={true}
        />
      </div>

      <div className="bg-night mx-10 my-10 w-full h-96 rounded-lg">
        <div className="flex flex-col mx-3 my-1">
          <h2 className="flex text-center mx-2 mt-5 mb-2 items-center justify-center bg-white rounded-md text-black h-12">
            The Facts
          </h2>
          <div className="flex flex-col text-white p-4 font-mono">
            <div className="flex space-x-3 items-center mb-7">
              <FaMoneyCheckDollar style={{ color: "white" }} size={45}/>
              <span>
                GDP
                <br />
                ${
                  (facts !== null) ? (facts.gdp * 1000000).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : 'N/A'
                }
              </span>
            </div>

            <div className="flex space-x-3 items-center mb-7">
              <RiLandscapeLine style={{ color: "white" }} size={45}/>
              <span>
                Total Area
                <br />
                {
                  (facts !== null) ? facts.area : 'N/A'
                } km<sup>2</sup>
                
              </span>
            </div>

            <div className="flex space-x-3 items-center mb-7">
              <GiLifeBar style={{ color: "white" }} size={45}/>
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
  );
}
