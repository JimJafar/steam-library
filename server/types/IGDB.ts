export type IGDBGame = {
  id: number;
  total_rating: number;
  genres: number[];
  parent_game: number;
  url: string;
};

export type IGDBGenre = {
  id: number;
  name: string;
};

export type IGDBTimeToBeat = {
  normally: number;
  hastily: number;
  completely: number;
};
