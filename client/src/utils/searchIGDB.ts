import axios from "axios";
import IGDBGameSearchResult from "../types/IGDBGameSearchResult";

const searchIGDB = async (name: string): Promise<IGDBGameSearchResult[]> => {
  const response = await axios.post(
    `${process.env.REACT_APP_API_URL}/search-igdb`,
    { name }
  );
  const { status, data } = response;

  if (status !== 200) {
    throw Error(`Error searching IGDB for "${name}"`);
  }

  return data;
};

export default searchIGDB;
