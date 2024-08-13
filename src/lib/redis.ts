var redisModule = require("redis");
import { Schema, Repository, EntityId } from "redis-om";
import { Coordinate } from "@/lib/cron/facts"

export type DailyFact = {
  gdp: number, // In million US$
  area: number, // In km^2
  lifeExpectancy: number // In years
}

export type DailyInfo = {
  country: string,
  population: number,
  facts: DailyFact,
  lat: number,
  lon: number,
  [key: string]: any
};

const redis =
  process.env.LOCAL_MODE === "1"
    ? redisModule.createClient()
    : redisModule.createClient({ url: process.env.REDIS_URL });

const errorDaily: DailyInfo = {
  country: "N/A",
  population: 0,
  lat: 0,
  lon: 0,
  facts: {
    gdp: 0,
    area: 0,
    lifeExpectancy: 0
  }
};

// Note Redis-OM doesn't allow for nested objects as of yet
const dailySchema = new Schema("daily", {
  country: { type: "string" },
  population: { type: "number" },
  lat: { type: "number" },
  lon: { type: "number" },
  facts: { type: "string[]" },
});

const dailyRepository = new Repository(dailySchema, redis);

export async function connect() {
  redis.on("error", (err) => console.error("Redis Client Error", err));
  await redis.connect();
}

export async function disconnect() {
  await redis.quit();
}

export async function readDaily() {
  await dailyRepository.createIndex();
  const dailys = await dailyRepository.search().return.all();

  if (dailys.length < 1) {
    console.error("No daily found in Redis");
    return errorDaily;
  } else if (dailys.length > 2) {
    console.error("More than 1 daily found in Redis");
    return errorDaily;
  }

  return dailys[0];
}

export async function saveDaily(daily: DailyInfo) {
  await dailyRepository.createIndex();
  const dailys = await dailyRepository.search().return.all();

  // No need to remove with a removal id array since there should only be
  // one iteration of this for loop anyway.
  for (const d of dailys) {
    await dailyRepository.remove(d[EntityId]);
  }

  await dailyRepository.save(daily);
}
