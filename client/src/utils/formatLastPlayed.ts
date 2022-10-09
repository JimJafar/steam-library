import dateFormat from "dateformat";
import Game from '../types/Game';

const formatLastPlayed = (game: Game) =>
  game.lastPlayed ? dateFormat(new Date(game.lastPlayed * 1000), 'dd mmm \'yy') : ''

export default formatLastPlayed
