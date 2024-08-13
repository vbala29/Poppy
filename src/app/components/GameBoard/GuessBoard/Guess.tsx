import Tiles from "@/app/components/GameBoard/Tiles"

type Props = {
    population: number;
    tilesToFill: number;
}

export default function Guess({ population, tilesToFill } : Props) {
  return (
    <div className="flex flex-col mb-3">
        <div className="flex items-center justify-center">
            <div className="flex items-center justify-center outline outline-1 outline-white bg-black text-white text-sm text-center text rounded-md h-8 w-32 mx-1 my-1">
                <h2 className="rounded-md my-0.5">{population.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</h2> 
            </div>
            <div className="ml-3 rounded-md">
                <Tiles width={5} height={5} tileCount={5} tilesToFill={tilesToFill} />
            </div>
        </div>
    </div>
  )
}
