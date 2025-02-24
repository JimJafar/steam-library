import { Request, Response } from "express";
import bodyParser from "body-parser";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import SteamGame from "./types/SteamGame";
import mergeMetadata from "./utils/mergeMetadata";
import parseSteamGames from "./utils/parseSteamGames";
import delay from "./utils/delay";
import Metadata from "./types/Metadata";
import shouldBeFetched from "./utils/shouldBeFetched";
import { clearLog, getLogs, writeLog } from "./utils/logging";
import scrapeSteam from "utils/scrapeSteam";
import checkEnv from "utils/checkEnv";
import { getSteamLibrary } from "utils/steam";
import { getMetadataStore, writeMetadataStore } from "utils/metadataStore";
import { enrichWithIGDBMetadata } from "utils/igdb";

dotenv.config();

checkEnv();

const app = express();
const port = 3042;
const { CORS_ORIGIN } = process.env;

app.use(
  cors({
    origin: CORS_ORIGIN,
    optionsSuccessStatus: 200, // legacy browsers
  })
);

app.use(bodyParser.json());

app.get("/library", async (req: Request, res: Response) => {
  // need to explicitly read the JSON file instead of importing it because there is no way to invalidate the import cache
  const metadata = getMetadataStore();
  const games: SteamGame[] = await getSteamLibrary();
  res.send(mergeMetadata(parseSteamGames(games), metadata));
});

app.post("/update-metadata", async (req: Request, res: Response) => {
  const games: SteamGame[] = await getSteamLibrary();
  const metadataOut: Metadata[] = req.body.forceAll ? [] : getMetadataStore();
  let game: SteamGame;
  let existingGame: Metadata | undefined;

  clearLog();
  writeLog(`Fetching metadata for ${games.length} games`);

  for (let i = 0; i < games.length; i++) {
    game = games[i];
    existingGame = metadataOut.find((meta: Metadata) => meta.id === game.appid);

    if (shouldBeFetched(existingGame)) {
      if (existingGame) {
        writeLog(`Re-fetching metadata for ${game.name}.`);
      }
      try {
        let newMetadata: Metadata = await scrapeSteam(game);

        if (existingGame) {
          writeLog(`Steam score: ${newMetadata.steamScore}`);
        }

        newMetadata = await enrichWithIGDBMetadata(game.name, newMetadata);

        if (existingGame) {
          metadataOut[metadataOut.indexOf(existingGame)] = newMetadata;
        } else {
          metadataOut.push(newMetadata);
        }
      } catch (e: any) {
        writeLog(
          `Fetching metadata for ${game.name} failed: ${e.message || ""}`
        );
      }

      await delay(250);
    }
  }

  writeLog(`Fetched metadata, writing to file`);

  writeMetadataStore(metadataOut);

  writeLog("Done. Returning metadata to client");

  res.send(mergeMetadata(parseSteamGames(games), metadataOut));
});

app.get("/logs", async (req: Request, res: Response) => {
  // need to explicitly read the JSON file instead of importing it because there is no way to invalidate the import cache
  const logs = getLogs();
  res.send({ logs });
});

app.listen(port, () => {
  writeLog(
    `Steam library server listening on port ${port} and allowing connections from ${CORS_ORIGIN}`
  );
});
