import React, { ChangeEvent, useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import GameTable from "./components/GameTable";
import "./App.css";
import Field from "./types/Field";
import Game from "./types/Game";
import sortFactory from "./utils/sortFactory";

const App = () => {
  const [loading, setLoading] = useState(true);
  const [updatingMetadata, setUpdatingMetadata] = useState(false);
  const [games, setGames] = useState([]);
  const [filteredGames, setFilteredGames] = useState<Game[]>([]);

  const onSort = (field: Field) => {
    const compare = sortFactory(
      field,
      [
        Field.playtime,
        Field.lastPlayed,
        Field.metacriticScore,
        Field.steamScore,
      ].includes(field)
    );
    setGames([...games].sort(compare));
    setFilteredGames([...filteredGames].sort(compare));
  };

  const onSearchChange = async (event: ChangeEvent) => {
    await scheduler.yield();
    const searchTerm = (event.target as HTMLInputElement).value.toLowerCase();
    setFilteredGames(
      games.filter((game: Game) => game.name.toLowerCase().includes(searchTerm))
    );
  };

  const fetchGames = async () => {
    const libraryResponse = await axios.get(
      `${process.env.REACT_APP_API_URL}/library`
    );
    if (!libraryResponse) {
      throw Error("Library not found");
    }
    const sortedGames = libraryResponse.data.sort(
      sortFactory(Field.steamScore, true)
    );
    setGames(sortedGames);
    setFilteredGames([...sortedGames]);
    setLoading(false);
  };

  const updateMetadata = async (forceAll: boolean = false) => {
    setUpdatingMetadata(true);
    await scheduler.yield();
    const worker = new Worker(
      new URL("./utils/updateMetadataWorker.ts", import.meta.url)
    );

    worker.onmessage = (event) => {
      const updateMetadataResponse = event.data;
      console.log("Received message from the worker:", updateMetadataResponse);
      if (updateMetadataResponse.status === 200) {
        setFilteredGames([...updateMetadataResponse.data]);
        setUpdatingMetadata(false);
        toast.success("Metadata updated successfully");
      } else {
        setUpdatingMetadata(false);
        toast.error("Failed to update metadata");
      }
      worker.terminate();
    };

    worker.postMessage({ forceAll });
  };

  useEffect(() => {
    fetchGames();
  }, []);

  return (
    <>
      {loading && <h3>Loading...</h3>}
      {!loading && (
        <>
          Showing {filteredGames.length} of {games.length} Steam games
          <p>
            <input
              type="text"
              onChange={onSearchChange}
              placeholder="Search..."
            />
            {!updatingMetadata && (
              <>
                <button type="button" onClick={() => updateMetadata()}>
                  Update missing metadata
                </button>
                <button type="button" onClick={() => updateMetadata(true)}>
                  Update ALL metadata
                </button>
              </>
            )}
            {updatingMetadata && " Updating Metadata..."}
          </p>
          <GameTable games={filteredGames} onSort={onSort} />
          <ToastContainer aria-label="toasts" />
        </>
      )}
    </>
  );
};

export default App;
