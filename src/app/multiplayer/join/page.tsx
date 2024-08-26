"use client";

import Head from "next/head";
import { ChangeEvent, useState } from "react";

export default function Home() {
  const [code, setCode] = useState('');
  
  function handleCodeInput(e: ChangeEvent<HTMLInputElement>): void {
    setCode(e.target.value);
  }

  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0"
        ></meta>
      </Head>

      <main className="min-h-screen bg-night">
        <div className="flex font-mono">
          <div className="w-1/3"></div>

          <div className="w-1/3 flex-col text-center justify-center bg-black mx-3.5 mt-10 rounded-md font-mono">
            <h1 className="text-white text-xl mt-7 mb-5 text-center">
              <b>Join a Multiplayer Game</b>
            </h1>
            <div className="flex flex-row text-center items-center justify-center mb-5">
              <form className="flex">
                <input
                  type="text"
                  placeholder="Enter Game Code"
                  value={code}
                  onChange={handleCodeInput}
                  className="bg-white outline outline-1 outline-grey h-fit text-grey rounded-md px-3 py-4 my-1"
                  style={{ minWidth: 0 }}
                />
              </form>
            </div>
            <div className="flex text-center items-center justify-center">
              <a
                href={`/multiplayer/${code}`}
                className="bg-blue w-1/3 text-white text-sm rounded-md h-fit py-4 mx-3 mb-6 hover:bg-night transition-colors duration-200"
              >
                <button>Join Game</button>
              </a>
            </div>
          </div>

          <div className="w-1/3"></div>
        </div>
      </main>
    </>
  );
}
