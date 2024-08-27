import React, { useState, useEffect, act } from "react";
import { Guess, MAX_TILE_COUNT, TileCount } from "../GameBoard";
import styles from "../styles.module.css";
import {
  Points,
  Score,
  UserName,
  MultiplayerGame,
  SCORE_INFO_BODY,
} from "../../../../../../../socket-types";
import { DailyInfo } from "@/lib/redis";
import formatPopulation from "@/lib/format";

export const NO_GUESS = -1;

type Props = {
  actualAnswer: Guess;
  clientAnswer: Guess;
  answerTileCount: TileCount;
  guessInfo: [Guess, TileCount][];
  openStartModal: boolean;
  setStartModal: (arg0: boolean) => void;
  openRoundStartModal: boolean;
  roundNumber: number;
  openRoundEndModal: boolean;
  openScoreModal: boolean;
  participants: MultiplayerGame;
  sortedRoundResults: SCORE_INFO_BODY;
  countryInfo: DailyInfo;
  gameEnd: boolean;
  restartGame: () => void;
};

export default function Modal({
  actualAnswer,
  clientAnswer,
  answerTileCount,
  guessInfo,
  openStartModal,
  setStartModal,
  openRoundStartModal,
  roundNumber,
  openRoundEndModal,
  openScoreModal,
  participants,
  sortedRoundResults,
  countryInfo,
  gameEnd,
  restartGame
}: Props) {

  function roundResultsJsx() {
    let roundResults: [UserName, Score, Points, Guess, TileCount][] = (() => {
      let output: [UserName, Score, Points, Guess, TileCount][] = [];
      for (const i of sortedRoundResults) {
        const [name, score]: [UserName, Score] = i;
        const points: Points = participants[name].points;
        const [guess, tileCount]: [Guess, TileCount] =
          participants[name].guessInfo !== null ? participants[name].guessInfo : [NO_GUESS, 0];
        output.push([name, score, points, guess, tileCount]);
      }
      return output;
    })();

    return roundResults.map((res, i) => {
      let [name, score, points, guess, tileCount]: [
        UserName,
        Score,
        Points,
        Guess,
        TileCount
      ] = res;
      let width = 2;
      let height = 2;
      return (
        <tr key={i} className="text-sm">
          <td className="text-center">
            <b>(+{score})</b> <span className="text-green-500">{name}</span>
          </td>
          <td>
            <div className="flex text-sm *:items-center justify-center">
              <div className="flex mr-2">
                {[...Array(MAX_TILE_COUNT)].map((_, i) => {
                  if (i < tileCount) {
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
              <div className="ml-2">{guess !== NO_GUESS ? formatPopulation(guess) : "No Guess"}</div>
            </div>
          </td>
          <td className="text-center">
            <b>{points}</b>
          </td>
        </tr>
      );
    });
  }


  let sortedFinalResults = Object.entries(participants).map((([userName, info]) => (
    {
      userName,
      ...info
    })
  )).sort((a, b) => b.points - a.points);

  let finalResults: JSX.Element[] =
    (() => {
      let output = [];
      let prevPoints = -1;
      let i = 1;
      let tieBuildup = 0;
      for (const { userName, guessInfo, points } of sortedFinalResults) {
        if (points === prevPoints) {
          tieBuildup++;
        } else {
          tieBuildup = 0;
        }

        output.push((
          <tr key={i} className="text-sm">
            <td className="text-center">{i - tieBuildup}.</td>
            <td className="text-center">
              <span className="text-green-500">{userName}</span>
            </td>
            <td className="text-center">
              <b>{points}</b>
            </td>
          </tr>
        ));
        i++;
      }
      return output;
    })();

  const width = 5;
  const height = 5;

  return (
    <>
      {openStartModal && (
        <>
          <div className="fixed inset-0 bg-gray-700 bg-opacity-50 z-30"></div>
          <div className="z-30 flex px-4 items-center justify-center inset-0 absolute font-mono text-center">
            <div className="bg-white rounded-lg shadow-lg max-w-md w-full">
              <div className="flex flex-col p-2 font-mono">
                <h2 className="text-lg font-semibold">Get Ready!</h2>
                <p className="mt-2 text-gray-600">
                  Click start once everyone has joined.
                </p>
                <div className="mt-2 text-blue">
                  <button
                    className="bg-blue hover:shadow-lg shadow-blue text-white rounded-md w-32 h-8 mt-3 px-2 text-sm"
                    onClick={() => setStartModal(false)}
                  >
                    <b>Start</b>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
      {openRoundStartModal && (
        <>
          <div className="fixed inset-0 bg-gray-700 bg-opacity-50 z-20"></div>
          <div className="z-20 flex px-4 items-center justify-center inset-0 absolute font-mono text-center">
            <div className="bg-white rounded-lg shadow-lg max-w-md w-full">
              <div className="flex flex-col p-2 font-mono">
                <h2 className="text-lg font-semibold">
                  Round {roundNumber} is about to start!
                </h2>
              </div>
            </div>
          </div>
        </>
      )}
      {openScoreModal && (
        <>
          <div className="fixed inset-0 bg-gray-700 bg-opacity-50 z-10"></div>
          <div className="z-10 flex px-4 items-center justify-center inset-0 absolute font-mono">
            <div className="bg-white rounded-lg shadow-lg max-w-md w-full">
              <div className="flex flex-col p-2 font-mono">
                <h2 className="text-lg text-black bg-yellow-500 rounded-md font-semibold text-center mb-1.5">
                  Round {roundNumber} Results!
                </h2>
                <table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Best Guess</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>{roundResultsJsx()}</tbody>
                </table>
                <div className="mt-4 text-center text-blue">
                  {countryInfo.country}'s population is{" "}
                  {formatPopulation(countryInfo.population)}
                </div>
                <div className="mt-2 text-center text-sm text-black">
                  Round {roundNumber + 1} will start soon
                </div>
              </div>
            </div>
          </div>
        </>
      )}
      {gameEnd && (
        <>
          <div className="fixed inset-0 bg-gray-700 bg-opacity-50 z-10"></div>
          <div className="z-10 flex px-4 items-center justify-center inset-0 absolute font-mono">
            <div className="bg-white rounded-lg shadow-lg max-w-md w-full">
              <div className="flex flex-col p-2 font-mono">
                <h2 className="text-lg text-black bg-yellow-500 rounded-md font-semibold text-center mb-1.5">
                  Game Over!
                </h2>
                <table>
                  <thead>
                    <tr>
                      <th>Rank</th>
                      <th>Name</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>{finalResults}</tbody>
                </table>
                <div className="flex items-center justify-center">
                  <button
                    className="bg-blue hover:bg-green-500 shadow-blue text-black rounded-md w-45 h-8 mt-3 px-2 text-sm"
                    onClick={() => restartGame()}
                  >
                    <b>Play Again!</b>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
