'use client'

import { ThreeCircles } from "react-loader-spinner";

type Props = {
  display: boolean
}

export default function LoadingScreen({ display } : Props) {
  return (
    <>
    { display &&
    <div className="flex-col items-center justify-center bg-night w-screen h-screen text-2xl z-50">
      <div className="text-center text-blue font-mono">
      <span style={{ position: "fixed", top: "40%", left: "50%", transform: "translate(-50%, -50%)" }}><b>Loading...</b></span>
        </div>
    </div>
    }
    </>
  )
}
