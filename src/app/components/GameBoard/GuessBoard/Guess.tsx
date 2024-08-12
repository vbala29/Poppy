import Tiles from "@/app/components/GameBoard/Tiles"

type Props = {
    population: number;
    tilesToFill: number;
}

export default function Guess({ population, tilesToFill } : Props) {
  return (
    <div className="flex flex-col mb-3">
        <div className="flex items-center justify-center">
            <div className="bg-black text-white text-center rounded-md h-7 w-32 mx-1">
                <h2 className="outline outline-1 outline-white px-6 rounded-md my-0.5">{population}</h2> 
            </div>
            <div className="ml-3 rounded-md">
                <Tiles width={5} height={5} tileCount={5} tilesToFill={tilesToFill} />
            </div>
        </div>
    </div>
  )
}