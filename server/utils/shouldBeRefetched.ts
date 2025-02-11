import Game from "types/Game";
import Metadata from "types/Metadata";

const shouldBeRefetched = (gameMetadata?: Metadata) => {
  if (!gameMetadata) {
    return true;
  }
  // if the game has no reviews, that's a reliable indicator that the last fetch failed
  return gameMetadata.steamReviewCount === 0;
};

export default shouldBeRefetched;
