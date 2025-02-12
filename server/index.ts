import { Request, Response } from "express";
import bodyParser from "body-parser";
import { decode } from "html-entities";
import { load } from "cheerio";
import express from "express";
import cors from "cors";
import axios from "axios";
import dotenv from "dotenv";
import fs from "fs";
import SteamGame from "./types/SteamGame";
import mergeMetadata from "./utils/mergeMetadata";
import parseSteamGames from "./utils/parseSteamGames";
import delay from "./utils/delay";
import Metadata from "./types/Metadata";
import shouldBeRefetched from "./utils/shouldBeRefetched";
import { clearLog, writeLog } from "./utils/logging";

dotenv.config();

const app = express();
const port = 3042;
const { STEAM_ID, STEAM_API_KEY, CORS_ORIGIN } = process.env;

if (!STEAM_ID || !STEAM_API_KEY || !CORS_ORIGIN) {
  throw Error("Please set up your .env files as described in the README.");
}

app.use(
  cors({
    origin: CORS_ORIGIN,
    optionsSuccessStatus: 200, // legacy browsers
  })
);

app.use(bodyParser.json());

app.get("/library", async (req: Request, res: Response) => {
  // need to explicitly read the JSON file instead of importing it because there is no way to invalidate the import cache
  const metadata = JSON.parse(fs.readFileSync("./metadata.json", "utf8"));
  const response = await axios.get(
    `http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${STEAM_API_KEY}&steamid=${STEAM_ID}&format=json&include_appinfo=true`
  );
  res.send(
    mergeMetadata(parseSteamGames(response.data.response.games), metadata)
  );
});

app.post("/update-metadata", async (req: Request, res: Response) => {
  const gamesResponse = await axios.get(
    `http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${STEAM_API_KEY}&steamid=${STEAM_ID}&format=json&include_appinfo=true`
  );
  const games: SteamGame[] = gamesResponse.data.response.games;
  const metadataOut: Metadata[] = req.body.forceAll
    ? []
    : JSON.parse(fs.readFileSync("./metadata.json", "utf8"));
  let game: SteamGame;
  let existingGame: Metadata | undefined;

  clearLog();
  writeLog(`Fetching metadata for ${games.length} games`);

  for (let i = 0; i < games.length; i++) {
    game = games[i];
    existingGame = metadataOut.find((meta: Metadata) => meta.id === game.appid);

    if (shouldBeRefetched(existingGame)) {
      try {
        const steamPage = await axios.get(
          `https://store.steampowered.com/app/${game.appid}`,
          {
            headers: {
              USER_AGENT:
                "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36",
              Cookie:
                "lastagecheckage=1-January-1982; wants_mature_content=1; birthtime=378691201;",
            },
          }
        );
        const $ = load(steamPage.data);
        if ($("#ageYear").length > 0) {
          writeLog(`Age gate hit for ${game.name}, skipping.`);
          continue;
        }
        const metacriticScore = $("#game_area_metascore > div.score")
          .first()
          ?.text();
        const metacriticLink = $("#game_area_metalink > a")
          .first()
          ?.attr("href");
        const steamScoreParts = $(
          "#review_histogram_rollup_section .game_review_summary"
        )
          .attr("data-tooltip-html")
          ?.split(" user")[0]
          ?.split("% of the ");
        const onMac: boolean =
          $("div.game_area_purchase_platform span.platform_img mac").length > 0;
        let onDeck = $("div#application_config")
          .first()
          .attr("data-deckcompatibility");

        try {
          switch (JSON.parse(decode(onDeck || "") || "{}").resolved_category) {
            case 1:
              onDeck = "Unsupported";
            case 2:
              onDeck = "Playable";
              break;
            case 3:
              onDeck = "Verified";
              break;
            default:
              onDeck = "";
          }
        } catch (e: any) {
          writeLog(`Error parsing onDeck for ${game.name} ${e?.message || ""}`);
        }

        metadataOut.push({
          id: game.appid,
          metacriticUrl: metacriticLink || "",
          metacriticScore: parseInt(metacriticScore) || 0,
          steamScore: steamScoreParts ? parseInt(steamScoreParts[0], 10) : 0,
          steamReviewCount: steamScoreParts
            ? parseInt(steamScoreParts[1].replace(",", ""), 10)
            : 0,
          onMac,
          onDeck: onDeck || "",
        });
      } catch (e: any) {
        writeLog(
          `Fetching metadata for ${game.name} failed: ${e.message || ""}`
        );
      }

      await delay(250);
    }
  }

  writeLog(`Fetched metadata, writing to file`);

  fs.writeFileSync(
    "./metadata.json",
    JSON.stringify(metadataOut, undefined, 2),
    {
      encoding: "utf8",
      flag: "w",
    }
  );

  writeLog("Done. Returning metadata to client");

  res.send(mergeMetadata(parseSteamGames(games), metadataOut));
});

app.get("/logs", async (req: Request, res: Response) => {
  // need to explicitly read the JSON file instead of importing it because there is no way to invalidate the import cache
  const logs = JSON.parse(fs.readFileSync("./metadata.log", "utf8"));
  res.send(logs);
});

app.listen(port, () => {
  writeLog(
    `Steam library server listening on port ${port} and allowing connections from ${CORS_ORIGIN}`
  );
});
