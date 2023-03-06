import Game from "types/Game";
import SteamGame from "types/SteamGame";

const parseSteamGames = (steamGames: SteamGame[]) => {
  return steamGames.map((game: SteamGame): Game => ({
      id: game.appid,
      name: game.name,
      icon: game.img_icon_url ? `http://media.steampowered.com/steamcommunity/public/images/apps/${game.appid}/${game.img_icon_url}.jpg` : '',
      playtime: game.playtime_forever,
      lastPlayed: game.rtime_last_played,
    }))
}

export default parseSteamGames
