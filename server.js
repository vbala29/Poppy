import { createServer } from "http";
import express from "express";
import next from "next";
import { Server } from "socket.io";
import { PLAYERS } from "./socket-messages.js";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;
// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

// type MultiplayerUser = {
//   guessInfo: [Guess, TileCount]
//   points: number,
// }
//
// type MultiplayerGame = {
//   users: Record<UserName, MultiplayerUser>
//
// }
// type MultiplayerData = {
//   games: Record<Code, MultiplayerGame>
// }

let multiplayerData = {
  games: {},
};

function generateGameCode(length = 8) {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";

  do {
    result = "";
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
  } while (multiplayerData.games.hasOwnProperty(result));

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

  const socketServer = io.on("connection", (socket) => {
    const code = socket.handshake.query.code;

    // Join the game room socket
    socket.join(code);

    socket.on("disconnect", () => {
      console.log("Client disconnected");
    });

    // Send list of users currently in game, including themselves
    socket.to(code).emit(PLAYERS, JSON.stringify(multiplayerData.games[code]));
  });

  server.post("/api/multiplayer/create", (req, res) => {
    const code = generateGameCode();
    multiplayerData.games[code] = {};
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

        if (!multiplayerData.games.hasOwnProperty(code)) {
          res.status(401).send(`Invalid game code provided: ${code}`);
          return;
        }

        if (multiplayerData.games[code].hasOwnProperty(name)) {
          res
            .status(401)
            .send(
              `User with this username (${name}) already exists in game: ${code}`
            );
        }

        multiplayerData.games[code][name] = { guessInfo: null, points: 0 };
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
