import Guess from "@/app/components/GameBoard/GuessBoard/Guess";
import { Guess as GuessType, TileCount } from "../GameBoard";

type Props = {
  guessInfo: [GuessType, TileCount][];
  gameOver: boolean
};

export const GUESSES_ALLOWED = 6;

export default function GuessBoard({ guessInfo, gameOver }: Props) {
  return (
    <>
      {
        guessInfo.map(([population, tilesToFill], index) => (
            <Guess key={index} population={population} tilesToFill={tilesToFill} />
        ))
      }
      {(() => {
            if (guessInfo.length < GUESSES_ALLOWED && !gameOver) {
                return (
                    <>
                    <div className="flex flex-col">
                        <div className="flex bg-black text-white items-center justify-center text-center rounded-md h-fit py-1 mt-1 mb-3 mx-1">
                        Guess {guessInfo.length + 1} / 6
                        </div>
                    </div>
                </>
                );
            } else {
                return (
                    <>
                    <div className="flex flex-col">
                        <div className="flex bg-black text-white items-center justify-center text-center rounded-md h-fit py-1 mt-1 mb-3 mx-1">
                        Game Over!
                        </div>
                    </div>
                </>
                );
            }
        })()
      }
    </>
  );
}
