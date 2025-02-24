import axios from "axios";
import { IGDBGame, IGDBGenre, IGDBTimeToBeat } from "types/IGDB";
import Metadata from "types/Metadata";
import { TwitchAuthResponse } from "types/Twitch";
import { writeLog } from "./logging";

export const enrichWithIGDBMetadata = async (
  gameName: string,
  metadata: Metadata,
  twitchAuth: TwitchAuthResponse
): Promise<Metadata> => {
  try {
    const game = await getGame(gameName, twitchAuth);

    if (!game) {
      writeLog(`IGDB metadata not found for ${gameName}`);
      return metadata;
    }

    const genres = await getGenres(twitchAuth);
    const timeToBeat = await getTimeToBeat(game.id, twitchAuth);

    metadata.igdbScore = game.total_rating;
    metadata.igdbUrl = game.url;
    metadata.igdbGenres = game.genres.map(
      (genreId) => genres.find((genre) => genre.id === genreId)?.name || ""
    );
    metadata.igdbTimeToBeat = timeToBeat;

    writeLog(`Fetched IGDB metadata for ${gameName}`);
  } catch (e: any) {
    writeLog(
      `Error fetching IGDB metadata for ${gameName}: ${e.message || ""}`
    );
  } finally {
    return metadata;
  }
};

export const getGame = async (
  gameName: string,
  twitchAuth: TwitchAuthResponse
): Promise<IGDBGame | undefined> => {
  try {
    const { data } = await axios.post(
      "https://api.igdb.com/v4/games",
      `where name = "${gameName}"; fields total_rating,genres,url; sort id asc;`,
      {
        headers: {
          "Client-ID": process.env.TWITCH_CLIENT_ID,
          Authorization: `Bearer ${twitchAuth.access_token}`,
        },
      }
    );

    return data.length > 0 ? (data[0] as IGDBGame) : undefined;
  } catch (e: any) {
    writeLog(`Error fetching IGDB game: ${e.message || ""}`);
    throw e;
  }
};

export const getTimeToBeat = async (
  gameId: number,
  twitchAuth: TwitchAuthResponse
): Promise<IGDBTimeToBeat> => {
  try {
    const { data } = await axios.post(
      "https://api.igdb.com/v4/game_time_to_beats",
      `fields normally,hastily,completely;where game_id = ${gameId};`,
      {
        headers: {
          "Client-ID": process.env.TWITCH_CLIENT_ID,
          Authorization: `Bearer ${twitchAuth.access_token}`,
        },
      }
    );

    return data as IGDBTimeToBeat;
  } catch (e: any) {
    writeLog(`Error fetching IGDB time to beat: ${e.message || ""}`);
    throw e;
  }
};

export const getGenres = async (
  twitchAuth: TwitchAuthResponse
): Promise<IGDBGenre[]> => {
  try {
    const { data } = await axios.post(
      "https://api.igdb.com/v4/genres",
      "fields name;",
      {
        headers: {
          "Client-ID": process.env.TWITCH_CLIENT_ID,
          Authorization: `Bearer ${twitchAuth.access_token}`,
        },
      }
    );

    return data as IGDBGenre[];
  } catch (e: any) {
    writeLog(`Error fetching IGDB genres: ${e.message || ""}`);
    throw e;
  }
};
