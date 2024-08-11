import Head from "next/head";
import Navbar from "@/app/components/Navbar";
import GameBoard from "@/app/components/GameBoard";

export default function Home() {
  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0"
        ></meta>
      </Head>
      <main className="min-h-screen bg-black">
        <Navbar />
        <GameBoard />
      </main>
    </>
  );
}
