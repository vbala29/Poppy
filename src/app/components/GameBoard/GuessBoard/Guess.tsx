import Tiles from "@/app/components/GameBoard/Tiles"
import { MAX_TILE_COUNT } from "../GameBoard"

type Props = {
    population: number;
    tilesToFill: number;
}

export default function Guess({ population, tilesToFill } : Props) {
  return (
    <div className="flex flex-col mb-3">
        <div className="flex items-center justify-center">
            <div className="flex items-center justify-center outline outline-1 outline-white bg-black text-white text-xs text-center text rounded-md h-fit py-1 w-32 px-2 mx-1 my-1">
                <h2 className="rounded-md my-0.5">{population.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</h2> 
            </div>
            <div className="ml-3 rounded-md">
                <Tiles width={5} height={5} tileCount={MAX_TILE_COUNT} tilesToFill={tilesToFill} />
            </div>
        </div>
    </div>
  )
}
