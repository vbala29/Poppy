'use client'

import QuizGlobe from "@/app/components/QuizGlobe";
import GuessBoard from "@/app/components/GameBoard/GuessBoard/GuessBoard"
import { FaPlay } from "react-icons/fa";
import { useState } from "react";

export default function GameBoard() {
  const [guessCount, setGuessCount] = useState(0);


  return (
    <div className="bg-night flex font-mono">
      <div className="bg-night mx-10 my-10 w-full h-96 rounded-lg">


        <div className="flex flex-col mx-3 my-1">
            <h2 className="flex text-center mx-3.5 my-5 items-center justify-center bg-white rounded-md text-black h-12">
                Country: Albania
            </h2>
            
            <div className="flex mx-3.5">
                <input type="numeric" placeholder="Enter population..." className="bg-white outline outline-1 outline-grey text-grey rounded-md border-none px-3 py-2 my-0.5 h-12" />
                <button className="bg-black text-white rounded-md px-4 py-2 h-12 ml-3 my-0.5 hover:bg-blue">Guess</button>
            </div>
           <div className="my-4 mx-3">
              <GuessBoard guessInfo={[["Albania", 3], ["America", 1]]}/>
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
