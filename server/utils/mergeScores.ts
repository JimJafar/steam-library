import Game from "types/Game";
import Metadata from "types/Metadata";

const mergeMetadata = (games: Game[], scores: Metadata[]) => {
    let matchedMetadata: Metadata | undefined
    return games.map((game): Metadata | Game => {
        matchedMetadata = scores.find((score: Metadata) => score.id === game.id)
        return {
            ...game,
            metacriticUrl: matchedMetadata?.metacriticUrl,
            metacriticScore: matchedMetadata?.metacriticScore,
            steamScore: matchedMetadata?.steamScore,
            steamReviewCount: matchedMetadata?.steamReviewCount,
            onMac: matchedMetadata?.onMac,
            onDeck: matchedMetadata?.onDeck,
        }
    })
}

export default mergeMetadata
