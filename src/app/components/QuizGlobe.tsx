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
  playGame: boolean;
};

export default function QuizGlobe({
  shadedCountry,
  endCoordinates,
  playGame,
}: Props) {
  const [data, setData] = useState(null);
  const [isLoading, setLoading] = useState(true);
  const [globeReady, setGlobeReady] = useState(false);
  const globeEl = useRef();

  useEffect(() => {
    fetch("/api/data/globe")
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        setLoading(false);
      });
  }, []);

  const spinTime = 3000;
  useEffect(() => {
    if (!globeEl.current) {
      return;
    }

    globeEl.current.pointOfView(
      {
        lat: endCoordinates.lat,
        lng: endCoordinates.lon,
        altitude: 2.5,
      },
      spinTime
    );

    // globeEl.current.controls().autoRotate = true;
    // globeEl.current.controls().autoRotateSpeed = 1;
  }, [globeReady]);

  if (isLoading) return <div>Loading...</div>;
  if (!data) return <div>Failed To Load Globe Data</div>;

  let countriesJson: GeoJson = data;

  const countries : { country: string }[] = [];
  for (const country of countriesJson.features) {
    countries.push({ country: country.properties.NAME });
  }

  return (
    <Globe
      globeImageUrl="//unpkg.com/three-globe/example/img/earth-dark.jpg"
      polygonsData={countriesJson.features}
      polygonCapColor={(country : GeoJsonFeature): string =>
        country.properties.NAME === shadedCountry ? "blue" : "grey"
      }
      polygonSideColor={() => "white"}
      polygonStrokeColor={() => "white"}
      polygonLabel={(country : GeoJsonFeature): string =>
        `<span style="font-family: ui-monospace;"> ${country.properties.NAME} </span>`
      }
      animateIn={true}
      ref={globeEl}
      onGlobeReady={() => setGlobeReady(true)}
      width={625}
      height={700}
    />
  );
}
