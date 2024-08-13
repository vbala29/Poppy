import Guess from "@/app/components/GameBoard/GuessBoard/Guess";

type Props = {
  guessInfo: [number, number][];
};

export default function GuessBoard({ guessInfo }: Props) {
  return (
    <>
      {
        guessInfo.map(([population, tilesToFill], index) => (
            <Guess key={index} population={population} tilesToFill={tilesToFill} />
        ))
      }
      {(() => {
            if (guessInfo.length < 6) {
                return (
                    <>
                    <div className="flex flex-col">
                        <div className="flex bg-black text-white items-center justify-center text-center rounded-md h-7 mt-1 mb-3 mx-1">
                        Guess {guessInfo.length + 1} / 6
                        </div>
                    </div>
                </>
                );
            } else {
                return (
                    <>
                    <div className="flex flex-col">
                        <div className="flex bg-black text-white items-center justify-center text-center rounded-md h-7 mt-6 mb-3 mx-1">
                        Game Over
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
