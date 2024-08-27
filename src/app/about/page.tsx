import Head from "next/head";
import { IoIosRose } from "react-icons/io";
import Link from "next/link";
import { FaAws } from "react-icons/fa";
import { SiRedis } from "react-icons/si";
import { SiSocketdotio } from "react-icons/si";
import { SiNextdotjs } from "react-icons/si";
import { RiTailwindCssFill } from "react-icons/ri";

export default function Home() {
    const ICON_SIZE = 60;
    const styling = "hover:text-blue transition-colors duration-200";
    return (
        <>
            <Head>
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1.0"
                ></meta>
            </Head>

            <main className="min-h-screen text-white bg-night">
                <div className="text-white font-mono justify-center items-center flex flex-col">
                    <div className="text-center">
                        <div className="flex text-3xl font-bold my-5">
                            The Story
                        </div>
                    </div>
                    <div className="text-center mx-52 text-md font-thin">
                        Poppy is a game that was first conceived of during a mid-autumn journey from Denver, Colorado to Albuquerque, New Mexico,
                        where we hoped to visit the Albuquerque International Balloon Fiesta. Clearly not stimulated enough by the vast landscape of mountains surrounding
                        us, the need for a classic car-ride game was ever present. 
                        <br /><br />
                        Thus, Poppy was born (though at the time was a nameless game), and we declared intention for the promulgation of our game, the next
                        of the great mini games (among Wordle, Worldle, the NYT mini, and many more), via a website.
                        <br /><br />
                        This website is dedicated to Paras, Eleni, and Riku, with whom this game was conceived. While the original game we played is an ancestor of the current multiplayer version,
                        I have also added a "daily" puzzle version (similar to how Wordle has a daily puzzle), which is what the <Link href="/" className="text-blue hover:font-bold underline">Home</Link> page is.
                    </div>
                    <div className="mt-16 mb-5">
                        <span className="flex justify-center items-center text-3xl font-mono font-bold">
                            <Link href="/" className="hover:text-blue transition-color duration-200 flex justify-center text-blue-800">
                                <IoIosRose size={30} />
                                Poppy
                            </Link>&nbsp;
                            <div className="text-xl font-normal">is powered by</div>&nbsp;
                            <Link href="https://www.nextjs.org/" target="_blank"><SiNextdotjs className={styling} size={ICON_SIZE} /></Link>&nbsp;+&nbsp;
                            <Link href="https://tailwindcss.com/" target="_blank"><RiTailwindCssFill className={styling} size={ICON_SIZE} /></Link>&nbsp;+&nbsp;
                            <Link href="https://socket.io/" target="_blank"><SiSocketdotio className={styling} size={ICON_SIZE} /></Link>&nbsp;+&nbsp;
                            <Link href="https://redis.io/" target="_blank"><SiRedis className={styling} size={ICON_SIZE} /></Link>&nbsp;+&nbsp;
                            <Link href="https://aws.amazon.com/" target="_blank"><FaAws className={styling} size={ICON_SIZE} /></Link>
                        </span>
                    </div>
                    <div>
                        If you more interested in the technical details of this project, please see the <Link href="https://github.com/vbala29/Poppy" target="_blank" className="text-blue hover:font-bold underline">GitHub Repository</Link>
                    </div>
                </div>
            </main>
        </>
    );
}
