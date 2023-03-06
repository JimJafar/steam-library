import Game from "types/Game";
import ReviewScore from "types/ReviewScore";

const mergeScores = (games: Game[], scores: ReviewScore[]) => {
    let matchedScore: ReviewScore | undefined
    return games.map((game): ReviewScore | Game => {
        matchedScore = scores.find((score: ReviewScore) => score.id === game.id)
        return {
            ...game,
            metacriticUrl: matchedScore?.metacriticUrl,
            metacriticScore: matchedScore?.metacriticScore,
            steamScore: matchedScore?.steamScore,
            steamReviewCount: matchedScore?.steamReviewCount
        }
    })
}

export default mergeScores
