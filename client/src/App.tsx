import React, { ChangeEvent, useEffect, useState } from 'react';
import axios from 'axios'
import GameTable from './components/GameTable';
import './App.css'
import Field from './types/Field';
import Game from './types/Game';
import sortFactory from './utils/sortFactory';

const App = () => {
  const [loading, setLoading] = useState(true)
  const [updatingScores, setUpdatingScores] = useState(false)
  const [games, setGames] = useState([])
  const [filteredGames, setFilteredGames] = useState<Game[]>([])

  const onSort = (field: Field) => {
    const compare = sortFactory(field, [Field.playtime, Field.lastPlayed, Field.metacriticScore, Field.steamScore].includes(field))
    setGames([...games].sort(compare))
    setFilteredGames([...filteredGames].sort(compare))
  }

  const onSearchChange = (event: ChangeEvent) => {
    setFilteredGames(
        games.filter((game: Game) =>
            game.name
              .toLowerCase()
              .includes((event.target as HTMLInputElement).value.toLowerCase())))
  }

  const fetchGames = async () => {
    const libraryResponse = await axios.get(`${process.env.REACT_APP_API_URL}/library`)
    if (!libraryResponse) {
      throw Error('Library not found')
    }
    const sortedGames = libraryResponse.data.sort(sortFactory(Field.steamScore, true))
    setGames(sortedGames)
    setFilteredGames([...sortedGames])
    setLoading(false)
  }

  const updateScores = async (forceAll: boolean = false) => {
    setUpdatingScores(true)
    const updateScoresResponse = await axios.post(`${process.env.REACT_APP_API_URL}/update-scores`, { forceAll })
    if (updateScoresResponse.status === 200) {
      setFilteredGames([...updateScoresResponse.data])
      setUpdatingScores(false)
    }
  }

  useEffect(() => {
    fetchGames()
  }, [])

  return <>
    {loading && <h3>Loading...</h3>}
    {!loading && (
      <>
        Showing {filteredGames.length} of {games.length} Steam games
        <p>
          <input type='text' onChange={onSearchChange} placeholder='Search...' />
          <button type='button' onClick={() => updateScores()} disabled={updatingScores}>Update missing scores</button>
          <button type='button' onClick={() => updateScores(true)} disabled={updatingScores}>Update ALL scores</button>
          {updatingScores && 'Updating scores...'}
        </p>
        <GameTable games={filteredGames} onSort={onSort} />
      </>
    )}
  </>
}

export default App
