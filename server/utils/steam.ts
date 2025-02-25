import axios from "axios";
import SteamGame from "types/SteamGame";

export const getSteamLibrary = async () => {
  const { STEAM_ID, STEAM_API_KEY } = process.env;
  const gamesResponse = await axios.get(
    `http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${STEAM_API_KEY}&steamid=${STEAM_ID}&format=json&include_appinfo=true`
  );
  const games: SteamGame[] = gamesResponse.data.response.games;
  return games;
};
