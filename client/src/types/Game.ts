type Game = {
  id: number,
  name: string,
  icon: string,
  playtime: number,
  lastPlayed: number,
  metacriticUrl: string | undefined,
  metacriticScore: number | undefined,
  steamScore: number | undefined,
  steamReviewCount: number | undefined,
}

export default Game
