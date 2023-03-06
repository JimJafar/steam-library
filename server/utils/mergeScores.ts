import Game from "types/Game";
import ReviewScore from "types/ReviewScore";

const mergeScores = (games: Game[], scores: ReviewScore[]) => {
    let matchedScore
    return games.map(game => {
        matchedScore = scores.find(score => score.id === game.id)
        return {
            ...game,
            metacriticUrl: matchedScore?.url,
            score: matchedScore ? matchedScore.score : 0
        }
    })
}

export default mergeScores
