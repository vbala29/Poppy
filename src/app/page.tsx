import Head from "next/head";
import GameBoard from "@/app/components/GameBoard/GameBoard";
import Modal from "@/app/components/GameBoard/Modal/Modal";

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
      <GameBoard />
      </main>
    </>
  );
}
