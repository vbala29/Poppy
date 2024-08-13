import React, { useState, useEffect, act } from "react";
import { MAX_TILE_COUNT } from "../GameBoard";
import styles from "../styles.module.css";

type Props = {
  gameOver: boolean;
  actualAnswer: number;
  clientAnswer: number;
  answerTileCount: number;
  guessInfo: [number, number][];
};

export default function Modal({
  gameOver,
  actualAnswer,
  clientAnswer,
  answerTileCount,
  guessInfo,
}: Props) {
  const [openModal, setModal] = useState(false);

  const closeModal = () => {
    setModal(false);
  };

  useEffect(() => {
    setModal(gameOver);
  }, [gameOver]);
  

  const copyResults = () => {
    const now = new Date();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const year = now.getFullYear();

    let guessesOutput = "";
    for (let [_, tileCount] of guessInfo) {
        guessesOutput += '🟩'.repeat(tileCount)
        guessesOutput += '⬜️'.repeat(MAX_TILE_COUNT - tileCount)
        guessesOutput += '\n'
    }

    navigator.clipboard.writeText(
      `PopQuiz™ (${month}/${day}/${year})\n` +
      `${answerTileCount === MAX_TILE_COUNT ? guessInfo.length : "X"}/${MAX_TILE_COUNT} ` +
      `(${(100 * (clientAnswer / actualAnswer)).toFixed(2)}%)\n` +
      `${guessesOutput}`
    )
  }

  const width = 5;
  const height = 5;

  return (
    <>
      {openModal && (
        <>
          <div
            className="fixed inset-0 bg-gray-700 bg-opacity-50 z-40"
            onClick={closeModal}
          ></div>

          <div className="fixed inset-0 flex px-4 z-50 items-center justify-center font-mono text-center">
            <div className="bg-white rounded-lg shadow-lg max-w-md w-full">
              <div className="flex p-2 font-mono">
                <button
                  onClick={closeModal}
                  className="bg-night text-white w-8 h-8 ml-1 mr-6 my-1 rounded-md hover:bg-blue-600"
                >
                  X
                </button>
                <div className="flex flex-col p-4">
                  <h2 className="text-lg font-semibold">Share Your Results!</h2>
                  <p className="mt-2 text-gray-600">
                    Your Answer: {clientAnswer.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                    <br />
                    Actual Answer: {actualAnswer.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                  </p>
                  <p className="mt-4 text-blue">
                    <b> Result</b>
                    <div className="flex text-sm *:items-center justify-center m-2">
                      <div className="mr-1">
                        {`${
                          answerTileCount === MAX_TILE_COUNT ? guessInfo.length : "X"
                        }/${MAX_TILE_COUNT} (${
                          (100 * (clientAnswer / actualAnswer)).toFixed(2)
                        }%)`}
                      </div>
                      {[...Array(MAX_TILE_COUNT)].map((_, i) => {
                        if (i < answerTileCount) {
                          return (
                            <div
                              key={i}
                              className={`bg-grey w-${width} h-${height} mx-2 ${styles.flip}`}
                              style={{
                                animationDelay: `${(i + 1) * 100}ms`,
                                height: height * 4,
                                width: width * 4,
                              }}
                            ></div>
                          );
                        } else {
                          return (
                            <div
                              key={i}
                              className={`bg-grey w-${width} h-${height} mx-2`}
                              style={{ height: height * 4, width: width * 4 }}
                            ></div>
                          );
                        }
                      })}
                    </div>
                    <button
                      onClick={copyResults}
                      className="bg-blue text-white rounded-md w-32 h-8 mt-3 px-2 text-sm hover:bg-blue-600"
                    >
                      <b>Copy Results</b>
                    </button>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
