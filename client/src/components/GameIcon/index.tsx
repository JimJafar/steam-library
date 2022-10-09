import React, { FC } from 'react'
import Game from '../../types/Game'

export type GameIconProps = {
  game: Game
}

const GameIcon: FC<GameIconProps> = ({ game }) => {
  return (
    <img src={game.icon} className='game-icon' alt={`${game.name} logo`} />
  )
}

export default GameIcon
