import QuizGlobe from "@/app/components/QuizGlobe";
import { FaPlay } from "react-icons/fa";

export default function GameBoard() {
  return (
    <div className="bg-night flex">
      <div className="bg-white mx-10 my-10 w-full h-96 rounded-lg"></div>

      <div className="">
        <QuizGlobe
          shadedCountry="Albania"
          startCoordinates={{ latitude: 37.0902, longitude: -95.7129 }}
          endCoordinates={{ latitude: 41.1533, longitude: 20.1683 }}
        />
      </div>

      <div className="bg-white mx-10 my-10 w-full h-96 rounded-lg"></div>
    </div>
  );
}
