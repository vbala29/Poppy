"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
const Globe = dynamic(() => import('react-globe.gl', { ssr: false}))

type Props = {
  shadedCountry: string;
};

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

export default function QuizGlobe({ shadedCountry }: Props) {
  const [data, setData] = useState(null);
  const [isLoading, setLoading] = useState(true);
  useEffect(() => {
    fetch("/api/data/globe")
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        setLoading(false);
      });
  }, []);

  if (isLoading) return <div>Loading...</div>;
  if (!data) return <div>Failed To Load Globe Data</div>;

  let countriesJson: GeoJson = data;

  const countries = [];
  for (const country of countriesJson.features) {
    countries.push({ country: country.properties.NAME });
  }

  return (
    <Globe
      globeImageUrl="//unpkg.com/three-globe/example/img/earth-dark.jpg"
      polygonsData={countriesJson.features}
      polygonCapColor={(country): string =>
        country.properties.NAME === shadedCountry ? "blue" : "grey"
      }
      polygonSideColor={() => "white"}

      backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
    />
  );
}
