import cheerio from 'cheerio'
import {  DailyInfo } from '@/lib/redis'
import { promises as fs } from 'fs'

type RestCountriesResponse = {
  area: number;
  population: number
  [key: string]: any;
};

type LifeExpectancyData = {
    country: string,
    lifeExpectancy: number
}

type GDPData = {
    country: string,
    gdp: number
}

async function updateDaily() {
    const randomCountryIndex = Math.floor(Math.random() * 177);
    let geojson = await fs.readFile(process.cwd() + '/datasets/ne_110m_admin_0_countries.geojson', 'utf8').then(f => JSON.parse(f))
    let countryName = geojson.features[randomCountryIndex].properties.NAME;
    let lifeExpectancyData: LifeExpectancyData = await getLifeExpectancies(countryName);
    let gdpData: GDPData = await getGDP(countryName);
    let restCountriesData: RestCountriesResponse = await restCountries(countryName);

    let dailyInfo : DailyInfo = {
        country: countryName,
        population: restCountriesData.population,
        facts: {
            area: restCountriesData.area,
            gdp: gdpData.gdp,
            lifeExpectancy: lifeExpectancyData.lifeExpectancy
        }
    }

    fetch(`http:${process.env.SITE_URL}/api/data/daily`, { 
        headers: {
            'Content-Type': 'application/json'
          },
        method: "POST",
        body: JSON.stringify(dailyInfo)
    }).then((res) => {
        if (res.status === 200) {
            console.log(`Updated daily information:\n${dailyInfo}`)
        } else {
            console.log(`Unable to update daily information\n${res}`)
        }
    }).catch((err) => {
        console.log(`Unable to update daily information\n${err}`)
    })
}   

async function getLifeExpectancies(country: string): Promise<LifeExpectancyData> {
    const URL = 'https://en.wikipedia.org/wiki/List_of_countries_by_life_expectancy';
    let response = await fetch(URL);
    let text = await response.text();
    let $ = cheerio.load(text);
    let table = $('table.wikitable').first();
    let rows = table.find('tbody > tr')
    let lifeExpectancyData: LifeExpectancyData = { country, lifeExpectancy: 0 };

    rows.each((index, row) => {
        if (index === 0) return; 
  
        let columns = $(row).find('td');
        if (columns.length < 2) return; 
  
        let countryInCol = $(columns[0]).text().trim();
        if (countryInCol !== country) {
            return;
        }
        let lifeExpectancy = $(columns[1]).text().trim();
  
        lifeExpectancyData = ({ country, lifeExpectancy: Number(lifeExpectancy) });
        return false;
      });

      return lifeExpectancyData;
}

async function getGDP(country: string): Promise<GDPData> {
    const URL = 'https://en.wikipedia.org/wiki/List_of_countries_by_GDP_(nominal)';
    let response = await fetch(URL);
    let text = await response.text();
    let $ = cheerio.load(text);
    let table = $('table.wikitable').first();
    let rows = table.find('tbody > tr')
    let gdpData: GDPData = { country, gdp: 0 };

    rows.each((index, row) => {
        if (index === 0) return; 
  
        let columns = $(row).find('td');
        if (columns.length < 2) return; 
  
        let countryInCol = $(columns[0]).text().trim();
        if (countryInCol !== country) {
            return;
        }
        let gdp = $(columns[1]).text().trim();
  
        gdpData = { country, gdp: Number(gdp) };
        return false;
      });

      return gdpData;
}

async function restCountries(country: string): Promise<RestCountriesResponse> {
  let restCountriesRes: RestCountriesResponse = await fetch(
    `https://restcountries.com/v3.1/name/${country}`
  )
    .then((res) => res.json())
    .catch(() => {{
      area: 0;
      population: 0
    }});

    return { area: restCountriesRes.area, population: restCountriesRes.population }
}
