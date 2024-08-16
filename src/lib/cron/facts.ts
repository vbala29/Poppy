import * as cheerio from "cheerio";
import { DailyInfo } from "@/lib/redis";
import { promises as fs } from "fs";

type RestCountriesResponse = {
  area: number;
  population: number;
  [key: string]: any;
};

type LifeExpectancyData = {
  country: string;
  lifeExpectancy: number;
};

type GDPData = {
  country: string;
  gdp: number;
};

export type Coordinate = {
    lat: number;
    lon: number;
  };

export async function getCountryCoordinates(
    country: string
  ): Promise<Coordinate> {
    const res = await fetch(
      `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(country)}&key=${process.env.OPEN_CAGE_API_KEY}`
    ).then((res) => res.json()).catch(err => console.log(err));

    if (res.results[0].geometry) {
      return { lat: res.results[0].geometry.lat, lon: res.results[0].geometry.lng }
    } else {
      console.log(`Unable to retrieve coordinates for ${country}`);
      return { lat: 0, lon: 0 };
    }
  }
  
async function getLifeExpectancies(
  country: string
): Promise<LifeExpectancyData> {
  const URL =
    "http://en.wikipedia.org/wiki/List_of_countries_by_life_expectancy";
  let response = await fetch(URL, { cache: "no-store" });
  let text = await response.text();
  let $ = cheerio.load(text);
  let table = $("table.wikitable").first();
  let rows = table.find("tbody > tr");
  let lifeExpectancyData: LifeExpectancyData = { country, lifeExpectancy: 0 };

  rows.each((index, row) => {
    if (index === 0) return;

    let columns = $(row).find("td");
    if (columns.length < 2) return;

    let countryInCol = $(columns[0]).text().trim();
    if (!countryInCol.startsWith(country)) {
      return;
    }
    let lifeExpectancy = $(columns[1]).text().trim();

    lifeExpectancyData = { country, lifeExpectancy: Number(lifeExpectancy) };
    return false;
  });

  return lifeExpectancyData;
}

async function getGDP(country: string): Promise<GDPData> {
  const URL =
    "https://en.wikipedia.org/wiki/List_of_countries_by_GDP_(nominal)";
  let response = await fetch(URL, { cache: "no-store" });
  let text = await response.text();
  let $ = cheerio.load(text);
  let table = $("table.wikitable").first();
  let rows = table.find("tbody > tr");
  let gdpData: GDPData = { country, gdp: 0 };

  rows.each((index, row) => {
    if (index === 0) return;

    let columns = $(row).find("td");
    if (columns.length < 2) return;

    let countryInCol = $(columns[0]).text().trim();
    if (!countryInCol.startsWith(country)) {
      return;
    }
    let gdp = $(columns[1]).text().trim();
    gdpData = { country, gdp: parseFloat(gdp.replace(/,/g, "")) };
    return false;
  });

  return gdpData;
}

async function restCountries(country: string): Promise<RestCountriesResponse> {
  let restCountriesRes: RestCountriesResponse = await fetch(
    `https://restcountries.com/v3.1/name/${country}`
  )
    .then((res) => res.json())
    .catch(() => {
      {
        area: 0;
        population: 0;
      }
    });

  return {
    area: restCountriesRes[0].area,
    population: restCountriesRes[0].population,
  };
}

export default async function updateDaily(): Promise<number> {
  const randomCountryIndex = Math.floor(Math.random() * 177);
  let geojson = await fs
    .readFile(
      process.cwd() + "/datasets/ne_110m_admin_0_countries.geojson",
      "utf8"
    )
    .then((f) => JSON.parse(f));
  let countryName = geojson.features[randomCountryIndex].properties.NAME;
  let lifeExpectancyData: LifeExpectancyData = await getLifeExpectancies(
    countryName
  );
  let gdpData: GDPData = await getGDP(countryName);
  let restCountriesData: RestCountriesResponse = await restCountries(
    countryName
  );

  let coordinateData: Coordinate = await getCountryCoordinates(countryName);

  let dailyInfo: DailyInfo = {
    country: countryName,
    population: restCountriesData.population,
    lat: coordinateData.lat,
    lon: coordinateData.lon,
    facts: {
      area: restCountriesData.area,
      gdp: gdpData.gdp,
      lifeExpectancy: lifeExpectancyData.lifeExpectancy,
    },
  };

  let updateCode = 200;
  fetch(`http://${process.env.SITE_URL}/api/data/daily`, {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify(dailyInfo),
  })
    .then((res) => {
      if (res.status === 200) {
        console.log(`Updated daily information: ${JSON.stringify(res)}`);
      } else {
        updateCode = res.status;
        console.log(
          `Unable to update daily information: ${JSON.stringify(res)}`
        );
      }
    })
    .catch((err) => {
      updateCode = 500;
      console.log(`Unable to update daily information error ocurred: ${err.toString()}`);
    });

  return updateCode;
}
