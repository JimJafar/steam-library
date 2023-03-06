import React, { FC } from 'react'
import Field from '../../types/Field'
import Game from '../../types/Game'
import formatLastPlayed from '../../utils/formatLastPlayed'
import formatPlaytime from '../../utils/formatPlaytime'
import GameIcon from '../GameIcon'

export type GameTableProps = {
  onSort: (field: Field) => void,
  games: Game[]
}

const GameTable: FC<GameTableProps> = ({ onSort, games }) => {
  return (
      <table>
        <thead>
        <tr>
          <th>&nbsp;</th>
          <th onClick={() => onSort(Field.name)}>name</th>
          <th onClick={() => onSort(Field.playtime)}>playtime</th>
          <th onClick={() => onSort(Field.lastPlayed)}>played</th>
          <th onClick={() => onSort(Field.score)}>score</th>
        </tr>
        </thead>
        <tbody>
        {games.map((game) => <tr key={game.id}>
          <td>{ game.icon && <GameIcon game={game} /> }</td>
          <td>{game.name}</td>
          <td>{formatPlaytime(game)}</td>
          <td className='nowrap'>{formatLastPlayed(game)}</td>
          <td>{game.metacriticUrl ? <a href={game.metacriticUrl} target="_blank" rel="noreferrer">{game.score}</a> : '' }</td>
        </tr>)}
        </tbody>
      </table>
  )
}

export default GameTable
