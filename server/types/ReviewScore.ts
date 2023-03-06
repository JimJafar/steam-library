type ReviewScore = {
  id: number,
  metacriticUrl: string | undefined,
  metacriticScore: number | undefined,
  steamScore: number | undefined,
  steamReviewCount: number | undefined,
}

export default ReviewScore
