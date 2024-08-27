"use client";

import Link from "next/link";
import { FaGithub, FaYoutube, FaGamepad } from "react-icons/fa";
import { usePathname } from "next/navigation";
import { IoIosRose } from "react-icons/io";

function checkActivePath(path: string): boolean {
  const pathname = usePathname();

  if (path === "/" && pathname !== path) {
    return false;
  }

  return pathname.startsWith(path);
}

export default function Navbar() {
  return (
    <nav className="z-50 flex relative justify-between items-center bg-black text-white p-4 font-mono flex-wrap">
      <div className="flex-shrink mx-5 flex space-x-10 flex-wrap">
        <Link className="hover:text-blue transition-color duration-200" href="/">
          <span
            style={{
              textDecoration: checkActivePath("/") ? "underline" : "none",
            }}
          >
            Home
          </span>
        </Link>
        <Link className="hover:text-blue transition-color duration-200" href="/multiplayer">
          <span
            style={{
              textDecoration: checkActivePath("/multiplayer")
                ? "underline" : "none",
            }}
          >
            Multiplayer
          </span>
        </Link>
      </div>

      <div className="flex flex-grow items-center justify-center space-x-3 p-3 mr-4 flex-shrink-0">
        <Link href="/" className="hover:text-blue transition-color duration-200 flex justify-center text-3xl font-mono font-bold text-blue-800">
          <IoIosRose size={30} />
          Poppy
        </Link>
      </div>

      <div className="flex flex-shrink mx-5 space-x-10 flex-wrap justify-center">
        <Link className="hover:text-blue transition-color duration-200" href="/about">
          <span
            style={{
              textDecoration: checkActivePath("/about") ? "underline" : "none",
            }}
          >
            About
          </span>
        </Link>
        <Link
          className="hover:text-blue transition-color duration-200"
          href="https://github.com/vbala29/Poppy"
          target="_blank"
        >
          <FaGithub size={23} />
        </Link>
        <Link
          className="hover:text-blue transition-color duration-200"
          href="https://github.com/vbala29/Poppy"
          target="_blank"
        >
          <FaYoutube size={23} />
        </Link>
      </div>
    </nav>
  );
}
