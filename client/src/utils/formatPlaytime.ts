import Game from '../types/Game';

const formatPlaytime = (game: Game) => {
  if (!game.playtime) {
    return ''
  }
  const fractionalHours = game.playtime / 60
  const wholeHours = Math.floor(fractionalHours)
  const minutes = `${Math.round((fractionalHours - wholeHours) * 60)}`.padStart(2, '0')
  return `${wholeHours}:${minutes}`
}

export default formatPlaytime
