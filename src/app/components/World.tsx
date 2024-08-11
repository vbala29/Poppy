"use client"

import { useState, useEffect, useRef, forwardRef } from "react";
import dynamic from "next/dynamic";

let Globe = () => null;
if (typeof window !== 'undefined') Globe = require('react-globe.gl').default;

const World = () => {
  const globeRef = useRef();
  const earthImg = "//unpkg.com/three-globe/example/img/earth-night.jpg";
  const backGroundImg = "//unpkg.com/three-globe/example/img/night-sky.png";

  const [globeReady, setGlobeReady] = useState(false);

  const startTime = 1000;

  useEffect(() => {
    if (!globeRef.current) {
        console.log("HI1")
      return;
    }
    console.log("Hi2")
    globeRef.current.pointOfView(
      {
        lat: 39.609913,
        lng: 500.962477,
        altitude: 2.5,
      },
      startTime
    );
    // globeRef.current.controls().enableZoom = false;
    // Auto-rotate
    globeRef.current.controls().autoRotate = true;
    globeRef.current.controls().autoRotateSpeed = 1;
  }, [globeReady]);

  return (
    <>
      <Globe
        globeImageUrl={earthImg}
         ref={globeRef}
        backgroundImageUrl={backGroundImg}
        onGlobeReady={() => setGlobeReady(true)}
        backgroundColor="rgba(0,0,0,0)"
        // height={500}
        hexPolygonMargin={0.7}
        hexPolygonColor={() => "rgba(255, 255, 255, 1)"}
        showAtmosphere={true}
        animateIn={true}
         //label
         labelColor={() => "#D5FFD0"}
         labelSize={0.5}
         labelDotRadius={0.4}
         labelResolution={6}
       
      />
    </>
  );
};

export default World;