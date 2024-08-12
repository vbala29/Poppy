'use client'

import QuizGlobe from "@/app/components/QuizGlobe";
import GuessBoard from "@/app/components/GameBoard/GuessBoard/GuessBoard"
import { FaPlay } from "react-icons/fa";
import { useState, useEffect, FormEvent, ChangeEvent } from "react";

function isNonNegativeInteger(value: string): boolean {
  return /^\d+$/.test(value);
}

export default function GameBoard() {
  const [guessInfo, setGuessInfo] = useState<[number, number][]>([]);
  const [country, setCountry] = useState('null');
  const [population, setPopulation] = useState('');

  // Route to request today's country
  useEffect(() => {
    setCountry('France');
  })
  

  const handlePopulationInput = (e : ChangeEvent<HTMLInputElement>): void => {
    setPopulation(e.target.value);
  };

  const submitGuess = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();

    if (isNonNegativeInteger(population)) {
      setGuessInfo(g => [...g, [Number(population), 3]])
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
                <input type="numeric" placeholder="Enter population..." value={population} onChange={handlePopulationInput} className="bg-white outline outline-1 outline-grey text-grey rounded-md px-3 py-2 my-0.5" />
                <button type="submit" className="bg-black text-white rounded-md px-4 py-2 h-12 ml-3 my-0.5 hover:bg-blue">Guess</button>
              </form>
           <div className="my-4 mx-3">
              <GuessBoard guessInfo={guessInfo}/>
           </div>
        </div>
      </div>

      <div className="">
        <QuizGlobe
          shadedCountry="Albania"
          startCoordinates={{ latitude: 37.0902, longitude: -95.7129 }}
          endCoordinates={{ latitude: 41.1533, longitude: 20.1683 }}
          playGame={true}
        />
      </div>

      <div className="bg-night mx-10 my-10 w-full h-96 rounded-lg">


<div className="flex flex-col mx-3 my-1">
    <h2 className="flex text-center mx-2 my-5 items-center justify-center bg-white rounded-md text-black h-12">
        The Facts
    </h2>
</div>


</div>
    </div>
  );
}
