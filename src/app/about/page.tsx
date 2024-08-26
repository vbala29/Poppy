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
                        <div className="flex text-xl font-bold my-5">
                            The Story
                        </div>
                    </div>
                    <div>
                        <span className="flex justify-center items-center text-3xl font-mono font-bold">
                            <Link href="/" className="hover:text-blue transition-color duration-200 flex justify-center text-blue-800">
                                <IoIosRose size={30} />
                                Poppy
                            </Link>&nbsp;
                            <div className="text-xl">is powered by</div>&nbsp;
                            <Link href="https://www.nextjs.org/" target="_blank"><SiNextdotjs className={styling} size={ICON_SIZE} /></Link>&nbsp;+&nbsp;
                            <Link href="https://tailwindcss.com/" target="_blank"><RiTailwindCssFill className={styling} size={ICON_SIZE} /></Link>&nbsp;+&nbsp;
                            <Link href="https://socket.io/" target="_blank"><SiSocketdotio className={styling} size={ICON_SIZE} /></Link>&nbsp;+&nbsp;
                            <Link href="https://redis.io/" target="_blank"><SiRedis className={styling} size={ICON_SIZE} /></Link>&nbsp;+&nbsp;
                            <Link href="https://aws.amazon.com/" target="_blank"><FaAws className={styling} size={ICON_SIZE} /></Link>
                        </span>
                    </div>
                </div>
            </main>
        </>
    );
}
