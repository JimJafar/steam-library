import axios from "axios";
import Game from "../types/Game";

const updateGame = async (game: Game): Promise<Game[]> => {
  const response = await axios.post(
    `${process.env.REACT_APP_API_URL}/update-game`,
    { game }
  );
  const { status, data } = response;

  if (status !== 200) {
    throw Error(`Error updating "${game.name}"`);
  }

  return data;
};

export default updateGame;
