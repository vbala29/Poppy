import Head from 'next/head'
import Navbar from '@/app/components/Navbar'
import QuizGlobe from "@/app/components/QuizGlobe"
import World from "@/app/components/World"

export default function Home() {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"></meta>
      </Head>
        <main className="min-h-screen bg-black">
          <Navbar />
          <QuizGlobe shadedCountry='Albania' startCoordinates={{ latitude: 37.0902, longitude: -95.7129 }} endCoordinates={{ latitude: 41.1533, longitude: 20.1683 }}/>
        </main>
    </>
  );
}
