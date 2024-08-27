"use client";

import dynamic from "next/dynamic";
import { useEffect, useState, useRef } from "react";
import { Coordinate } from "@/lib/cron/facts";

let Globe = () => null;
if (typeof window !== "undefined") Globe = require("react-globe.gl").default;

type GeoJsonProperty = {
  NAME: string;
  [key: string]: any;
};

type GeoJsonFeature = {
  properties: GeoJsonProperty;
  [key: string]: any;
};

type GeoJson = {
  features: Array<GeoJsonFeature>;
  [key: string]: any;
};

type Props = {
  shadedCountry: string;
  endCoordinates: Coordinate;
  rendered: () => void;
};

const globeWidthRatio = 2.15;
const globeHeightRatio = 1.10;

export default function QuizGlobe({
  shadedCountry,
  endCoordinates,
  rendered,
}: Props) {
  const [data, setData] = useState(null);
  const [isLoading, setLoading] = useState(true);
  const [globeReady, setGlobeReady] = useState(false);
  const [globeWidth, setGlobeWidth] = useState(0);
  const [globeHeight, setGlobeHeight] = useState(0);
  const globeEl = useRef();

  function handleResize() {
    if (window.innerWidth < 1200) {
      setGlobeWidth(window.innerWidth);
      setGlobeHeight(window.innerHeight);
    } else {
      setGlobeWidth(window.innerWidth / globeWidthRatio);
      setGlobeHeight(window.innerHeight / globeHeightRatio);
    }
  }

  useEffect(() => {
    window.addEventListener("resize", handleResize, false);
    handleResize();
    fetch("/api/data/globe")
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        setLoading(false);
      });
  }, []);

  const spinTime = 2000;
  useEffect(() => {
    if (!globeEl.current) {
      return;
    }

    globeEl.current.pointOfView({
      lat: endCoordinates.lat,
      lng: endCoordinates.lon,
      altitude: 2.5,
    }, spinTime);

  }, [globeReady, endCoordinates]);

  if (isLoading) return <div>Loading...</div>;
  if (!data) return <div>Failed To Load Globe Data</div>;

  let countriesJson: GeoJson = data;

  const countries: { country: string }[] = [];
  for (const country of countriesJson.features) {
    countries.push({ country: country.properties.NAME });
  }

  return (
    <Globe
      globeImageUrl="//unpkg.com/three-globe/example/img/earth-dark.jpg"
      polygonsData={countriesJson.features}
      polygonCapColor={(country: GeoJsonFeature): string =>
        country.properties.NAME === shadedCountry ? "blue" : "grey"
      }
      polygonSideColor={() => "white"}
      polygonStrokeColor={() => "white"}
      polygonLabel={(country: GeoJsonFeature): string =>
        `<span style="font-family: ui-monospace;"> ${country.properties.NAME} </span>`
      }
      animateIn={true}
      ref={globeEl}
      onGlobeReady={() => {
        rendered();
        setGlobeReady(true);
      }} 
      width={globeWidth}
      height={globeHeight}
    />
  );
}
