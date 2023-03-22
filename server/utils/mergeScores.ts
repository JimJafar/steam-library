import Game from "types/Game";
import Metadata from "types/Metadata";

const mergeMetadata = (games: Game[], scores: Metadata[]) => {
    let matchedScore: Metadata | undefined
    return games.map((game): Metadata | Game => {
        matchedScore = scores.find((score: Metadata) => score.id === game.id)
        return {
            ...game,
            metacriticUrl: matchedScore?.metacriticUrl,
            metacriticScore: matchedScore?.metacriticScore,
            steamScore: matchedScore?.steamScore,
            steamReviewCount: matchedScore?.steamReviewCount
        }
    })
}

export default mergeMetadata
