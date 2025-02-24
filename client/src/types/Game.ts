import SteamDeckSupportLevel from "./SteamDeckSupportLevel";

type Game = {
  id: number;
  name: string;
  icon: string;
  playtime: number;
  lastPlayed: number;
  metacriticUrl?: string;
  metacriticScore?: number;
  steamScore?: number;
  steamReviewCount?: number;
  onMac: boolean;
  onDeck: SteamDeckSupportLevel;
  igdbScore?: number;
  igdbGenres?: string[];
  igdbTimeToBeat?: {
    normally: number;
    hastily: number;
    completely: number;
  };
  igdbUrl?: string;
};

export default Game;
