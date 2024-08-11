import QuizGlobe from "@/app/components/QuizGlobe";
import Tiles from "@/app/components/GameBoard/Tiles"
import { FaPlay } from "react-icons/fa";

export default function GameBoard() {
  return (
    <div className="bg-night flex font-mono">
      <div className="bg-night mx-10 my-10 w-full h-96 rounded-lg">


        <div className="flex flex-col mx-3 my-1">
            <h2 className="flex text-center mx-2 my-5 items-center justify-center bg-white rounded-md text-black h-12">
                Country: Albania
            </h2>
            
            <div className="flex">
                <input type="numeric" placeholder="Enter population..." className="bg-white outline outline-1 outline-grey text-grey rounded-md border-none px-3 py-2 mx-1 my-0.5 h-12" />
                <button className="bg-black text-white rounded-md px-4 py-2 h-12 mx-1 my-0.5 hover:bg-blue-600">Guess</button>
            </div>
            <div className="flex flex-col">
                <div className="flex bg-black text-white items-center justify-center text-center rounded-md h-7 mt-6 mb-3 mx-1">
                    Guess 1 / 6
                </div>
            </div>
            <div className="flex flex-col mb-3">
                <div className="flex items-center">
                    <div className="bg-black text-white text-center rounded-md h-7 mx-1 ml-2">
                      <h2 className="outline outline-1 outline-white px-6 rounded-md my-0.5">Albania</h2> 
                    </div>
                    <div className="ml-3 rounded-md">
                      <Tiles width={5} height={5} tileCount={5} />
                    </div>
                </div>
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
