"use client";

import Link from "next/link";
import { FaGithub, FaYoutube, FaGamepad } from "react-icons/fa";
import { usePathname } from "next/navigation";

function checkActivePath(path: string): boolean {
  const pathname = usePathname();

  if (path === "/" && pathname !== path) {
    return false;
  }

  return pathname.startsWith(path);
}

export default function Navbar() {
  return (
    <nav className="flex justify-between items-center my-2 bg-white text-black p-4 font-mono">
        
      <div className="flex-shrink mx-5 flex space-x-10">
        <Link className="hover:text-blue" href="/home">
          <span style={{textDecoration: checkActivePath("/") ? "underline" : "none"}}>Home</span>
        </Link>
        <Link className="hover:text-blue" href="/multiplayer">
            <span style={{textDecoration: checkActivePath("/multiplayer") ? "underline" : "none"}}>Multiplayer</span>
        </Link>
      </div>
    
      <div className="flex flex-grow items-center justify-center space-x-3 p-3">
        <FaGamepad size={30} />
        <span className="text-3xl font-mono font-bold text-blue-800">PopQuiz</span>
      </div>

      <div className="flex flex-shrink mx-5 space-x-10">
        <Link className="hover:text-blue" href="/about">
          <span style={{textDecoration: checkActivePath("/about") ? "underline" : "none"}}>About</span>
        </Link>
        <Link className="hover:text-blue" href="https://github.com/vbala29/PopQuiz">
          <FaGithub size={22}/>
        </Link>
        <Link className="hover:text-blue" href="https://github.com/vbala29/PopQuiz">
          <FaYoutube size={22}/>
        </Link>
      </div>
    </nav>
  );
}