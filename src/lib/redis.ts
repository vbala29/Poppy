var redisModule = require("redis");
import { Schema, Repository, EntityId } from "redis-om";

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


// // Please redis-om, let me use nested objects :(
// export type MultiplayerGame = {
//   code: string,
//   names: string[],
//   guessInfo: string[], // Comma separated "Guess, TileCount" since Redis Om doesn't have [number, number][] type
//   points: number[]
// };

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

const multiplayerSchema = new Schema("multiplayer", {
  code: { type: "string" },
  names: { type: "string[]" },
  guessInfo: { type: "string[]" },
  points: { type: "number[]" }
});

const dailyRepository = new Repository(dailySchema, redis);
const multiplayerRepository = new Repository(multiplayerSchema, redis);

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

// // Returns false if a game with the proposed code already exists.
// export async function createNewGame(code: string) : Promise<boolean> {
//   await multiplayerRepository.createIndex();
//   const existingGames : Record<string, any>[] = await multiplayerRepository.search().where('code').equals(code).return.all();
//   if (existingGames.length > 0) {
//     return false;
//   } 

//   const newGame = {
//     code,
//     names: [],
//     guessInfo: [],
//     points: []
//   }
  
//   await multiplayerRepository.save(newGame);

//   return true;
// }

// export async function joinGame(code: string, name: string) {
//   await multiplayerRepository.createIndex();
//   let existingGames : Record<string, any>[] = await multiplayerRepository.search().where('code').equals(code).return.all();

//   if (existingGames.length == 0) {
//     console.error(`Wasn't able to find game with code: ${code}`);
//     return;
//   } else if (existingGames.length > 1) {
//     console.error("Found multiple games with same code");
//     return;
//   }

//   let game = existingGames[0];
//   game.names.push(name);
//   game.guessInfo.push('');
//   game.points.push(0);
  
//   await multiplayerRepository.save(game);
// }