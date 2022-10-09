import axios from "axios"
import React, { ChangeEvent, useEffect, useState } from 'react';
import GameTable from "./components/GameTable";
import './App.css'
import Field from './types/Field';
import Game from './types/Game';

const App = () => {
  const [loading, setLoading] = useState(true)
  const [games, setGames] = useState([])
  const [filteredGames, setFilteredGames] = useState<Game[]>([])

  const sortFactory = (field: Field, desc = false) => (a: Game, b: Game) => {
    if (a[field] < b[field]) {
      return desc ? 1 : -1
    }
    if (a[field] > b[field]) {
      return desc ? -1 : 1
    }
    return 0
  }

  const onSort = (field: Field) => {
    const compare = sortFactory(field, ['playtime', 'lastPlayed'].includes(field))
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
    setGames(libraryResponse.data)
    setFilteredGames([...libraryResponse.data])
    setLoading(false)
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
          <input type="text" onChange={onSearchChange} placeholder='Search...' />
        </p>
        <GameTable games={filteredGames} onSort={onSort} />
      </>
    )}
  </>
}

export default App
