import { createServer } from "http";
import express from "express";
import next from "next";
import { Server } from "socket.io";
import {
  START,
  PLAYERS,
  START_REQUEST,
  SCORE_INFO,
  ROUND_DELAY,
  ROUND_INFO,
  ROUND_START,
  ROUND_END,
  GUESS,
  PLAYERS_UPDATE,
  ROUND_INTERLUDE,
  GUESS_MADE,
  GUESS_UPDATE,
  GAME_END,
} from "./socket-messages.js";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;
// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

// See socket-types.ts
let multiplayerData = {};
let multiplayerBookkeeping = {};

function generateGameCode(length = 8) {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";

  do {
    result = "";
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
  } while (multiplayerData.hasOwnProperty(result));

  return result;
}

app.prepare().then(() => {
  const server = express();
  const httpServer = createServer(server);
  const io = new Server(httpServer, {
    cors: {
      origin: `http://${process.env.NEXT_PUBLIC_SITE_URL}`,
    },
  });

  const MAX_ROUNDS = 6; // Number of rounds in the game.

  async function roundStartSequence(code) {
    let roundInfoBody = await fetch(
      `http://${process.env.NEXT_PUBLIC_SITE_URL}/api/data/multiplayer`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(multiplayerBookkeeping[code].previouslySelected),
      }
    );

    let roundInfo = await roundInfoBody.json();
    // Update list of previously selected countries.
    multiplayerBookkeeping[code].previouslySelected.push(roundInfo.country);
    multiplayerBookkeeping[code].population = roundInfo.population;
    // console.log("Selected round info for game", roundInfo);
    io.to(code).emit(ROUND_INFO, roundInfo);

    setTimeout(() => {
      io.to(code).emit(ROUND_START, "");
      // console.log("Sent start round request");
    }, ROUND_DELAY);
  }

  const socketServer = io.on("connection", (socket) => {
    const code = socket.handshake.query.code;

    // Join the game room socket
    socket.join(code);

    socket.on("disconnect", () => {
      console.log("Client disconnected");
    });

    socket.on(START_REQUEST, async (code) => {
      if (multiplayerBookkeeping[code].started) {
        return;
      }
      multiplayerBookkeeping[code].started = true;

      io.to(code).emit(START, ""); // Tell the other nodes that game has started

      roundStartSequence(code); // Fetch ROUND_INFO and call ROUND_START
    });

    socket.on(ROUND_END, () => {
      if (multiplayerBookkeeping[code].roundEnded) {
        return;
      }

      // Scoring
      const answer = multiplayerBookkeeping[code].population;
      let game = multiplayerData[code];
      let roundResults = [];
      Object.keys(game).forEach((user) => {
        if (game[user].guessInfo === null) {
          roundResults.push([user, Number.MAX_VALUE]);
        } else {
          roundResults.push([user, Math.abs(game[user].guessInfo[0] - answer)]);
        }
      });
      roundResults.sort((a, b) => a[1] - b[1]); // Sort in increasing order by absolute value distance from answer.

      let bestDifferential = Number.MIN_VALUE;
      let rank = 0;
      let maxPoints = roundResults.length; // Number of users in the game.
      let tieBuildup = 0;
      // Push scores to the sorted array.
      for (let index = 0; index < roundResults.length; index++) {
        let i = roundResults[index];
        let differential = i[1];
        if (differential > bestDifferential) {
          bestDifferential = differential;
          i.pop();
          i.push(maxPoints - rank);
          tieBuildup = 0;
        } else if (differential == bestDifferential) {
          tieBuildup++;
          i.pop();
          i.push(maxPoints - rank + tieBuildup);
        } else {
          console.error(
            "Algorithm for score calculation found unsorted scores"
          );
        }

        rank++;
      }

      // Round number update to next round.
      multiplayerBookkeeping[code].roundNumber++;
      multiplayerBookkeeping[code].roundEnded = true;
      // Calculate information about total points accumulation of each user.
      for (const i of roundResults) {
        let userName = i[0];
        let score = i[1];
        multiplayerData[code][userName].points += score;
      }

      // Next round initiation sequence.
      const SCORE_MODAL_TIME_MS = 5000;
      setTimeout(() => {
        multiplayerBookkeeping[code].roundEnded = false;
        if (multiplayerBookkeeping[code].roundNumber > MAX_ROUNDS) {
          // Game over
          io.to(code).emit(GAME_END, "");
          multiplayerBookkeeping[code] = {
            previouslySelected: [],
            roundNumber: 1,
            started: false,
            population: 0,
            roundEnded: false,
          };
          multiplayerData[code] = {};
        } else {
          Object.keys(game).forEach((user) => {
            game[user].guessInfo = null;
          });
          io.to(code).emit(
            ROUND_INTERLUDE,
            multiplayerBookkeeping[code].roundNumber
          );
          roundStartSequence(code); // Fetch ROUND_INFO and call ROUND_START
        }
      }, SCORE_MODAL_TIME_MS);

      io.to(code).emit(PLAYERS_UPDATE, multiplayerData[code]); // Send updated point tallies and guessInfo.
      io.to(code).emit(SCORE_INFO, roundResults); // Send sorted names/scores.
    });

    socket.on(GUESS, ([name, guessInfo]) => {
      multiplayerData[code][name].guessInfo = guessInfo;
      // console.log(
      //   "recorded best guess for code: " +
      //     code +
      //     ", name: " +
      //     name +
      //     ", guess: " +
      //     guessInfo
      // );
    });

    socket.on(GUESS_MADE, (guess) => {
      io.to(code).except(socket.id).emit(GUESS_UPDATE, guess); // Don't need to tell a user their own guess so we use except().
    });
  });

  server.post(`/api/multiplayer/create`, (req, res) => {
    const code = generateGameCode();
    multiplayerData[code] = {};
    multiplayerBookkeeping[code] = {
      previouslySelected: [],
      roundNumber: 1,
      started: false,
      population: 0,
      roundEnded: false,
    };
    console.log("Created game with code: " + code);
    res.status(201).json({ code }).end();
  });

  // Custom JSON parser because can't use express json parser middleware as this leads to Next.JS double parsing
  server.post("/api/multiplayer/join", async (req, res) => {
    let rawData = "";

    req.on("data", (chunk) => {
      rawData += chunk;
    });

    req.on("end", () => {
      try {
        let body = JSON.parse(rawData);
        const code = body.code;
        const name = body.name;

        if (!multiplayerData.hasOwnProperty(code)) {
          res.status(401).send(`Invalid game code provided: ${code}`);
          return;
        } else if (multiplayerBookkeeping[code].started) {
          res.status(401).send('Game has already started, please wait for it to end and then join.');
          return;
        }

        if (multiplayerData[code].hasOwnProperty(name)) {
          res
            .status(401)
            .send(
              `User with this username (${name}) already exists in game: ${code}`
            );
            return;
        }
        // Update data store
        multiplayerData[code][name] = { guessInfo: null, points: 0 };

        // Send list of users currently in game, including themselves
        io.to(code).emit(PLAYERS, multiplayerData[code]);

        res.status(200).end();
      } catch (error) {
        res.status(400).json({ error: "Invalid JSON" }).end();
      }
    });
  });

  server.all("*", (req, res) => handler(req, res));

  httpServer
    .once("error", (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
});
