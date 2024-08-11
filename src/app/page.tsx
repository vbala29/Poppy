import Head from 'next/head'
import Navbar from '@/app/components/Navbar'
import QuizGlobe from "@/app/components/QuizGlobe"

export default function Home() {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"></meta>
      </Head>
        <main className="min-h-screen bg-black">
          <Navbar />
          <QuizGlobe shadedCountry='Albania' />
        </main>
    </>
  );
}
