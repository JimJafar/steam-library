export type IGDBGame = {
  id: number;
  total_rating: number;
  genres: number[] | string[];
  parent_game: number;
  url: string;
};

export type IGDBGameSearchResult = IGDBGame &
  {
    name: string;
    summary: string;
  }[];

export type IGDBGenre = {
  id: number;
  name: string;
};

export type IGDBGameSearchResults = IGDBGameSearchResult[];

export type IGDBTimeToBeat = {
  normally: number;
  hastily: number;
  completely: number;
};
