import React, { ChangeEvent, useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";
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
  const [logs, setLogs] = useState("");

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

  const showLogs = async () => {
    const logsResponse = await axios.get(
      `${process.env.REACT_APP_API_URL}/logs`
    );
    setLogs(logsResponse.data.logs);
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
                <Button type="button" onClick={() => updateMetadata()}>
                  Update missing metadata
                </Button>
                <Button type="button" onClick={() => updateMetadata(true)}>
                  Update ALL metadata
                </Button>
                <Button type="button" onClick={() => showLogs()}>
                  Logs
                </Button>
              </>
            )}
            {updatingMetadata && " Updating Metadata..."}
          </p>
          <GameTable games={filteredGames} onSort={onSort} />
          <ToastContainer aria-label="toasts" />
          <Modal
            open={logs.length > 0}
            onClose={() => setLogs("")}
            aria-labelledby="logs"
            aria-describedby="logs"
          >
            <div>
              <h2>Logs</h2>
              <pre>{logs}</pre>
            </div>
          </Modal>
        </>
      )}
    </>
  );
};

export default App;
