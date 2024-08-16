"use client"

import Head from "next/head";
import { useEffect, useState } from "react";
import { FaRegCopy } from "react-icons/fa6";

export default function Home() {
    const [code, setCode] = useState('Loading');
    useEffect(() => {
        fetch("/api/multiplayer/create", { method: "POST" }).then(res => res.json()).then(data => setCode(data.code));
    }, [])

    const copyResults = () => {
        navigator.clipboard.writeText(code)
    };

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

          <div className="w-1/3 flex-col text-center justify-center bg-white mx-3.5 mt-10 rounded-md font-mono">
            <h1 className="text-black text-xl mt-7 mb-5 text-center">
              <b>Create a New Game</b>
            </h1>
            <div className="flex flex-row text-center items-center justify-center mb-5">
              <div className="">Your Code&nbsp;</div>
              <div className="p-2 shadow-md shadow-grey/200 rounded-md mr-1">
                {code}
              </div>
              <button
                className="hover:shadow-md hover:shadow-grey/200 hover:rounded-md m-0.5 p-1.5"
                onClick={copyResults}
              >
                <FaRegCopy size={20} />
              </button>
            </div>
            <div className="flex text-center items-center justify-center">
              <a
                href={`/multiplayer/${code}`}
                className="bg-blue w-1/3 text-white text-sm rounded-md h-fit py-4 mx-3 mb-6 hover:bg-black"
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
