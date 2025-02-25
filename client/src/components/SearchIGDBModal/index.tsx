import React, { FC, useEffect, useState } from "react";
import {
  Button,
  Card,
  CircularProgress,
  MenuItem,
  Modal,
  Select,
} from "@mui/material";
import { toast } from "react-toastify";
import Game from "../../types/Game";
import searchIGDB from "../../utils/searchIGDB";
import IGDBGameSearchResult from "../../types/IGDBGameSearchResult";
import updateGame from "../../utils/updateGame";

export type SearchIGDBModalProps = {
  game: Game | undefined;
  onClose: () => void;
  onUpdated: () => void;
};

const SearchIGDBModal: FC<SearchIGDBModalProps> = ({
  game,
  onClose,
  onUpdated,
}) => {
  const [searching, setSearching] = useState(false);
  const [saving, setSaving] = useState(false);
  const [selectedGame, setSelectedGame] = useState<IGDBGameSearchResult | null>(
    null
  );
  const [results, setResults] = useState<IGDBGameSearchResult[]>([]);

  const doSearch = async (name: string) => {
    setSearching(true);
    try {
      const games = await searchIGDB(name);
      setResults(games);
      setSelectedGame(games[0]);
    } catch (e: any) {
      toast.error(`Error searching IGDB for "${name}": ${e.message || ""}`);
      console.error(e);
    } finally {
      setSearching(false);
    }
  };

  const doUpdate = async () => {
    if (!selectedGame || !game) {
      return;
    }
    setSaving(true);
    try {
      await updateGame({
        ...game,
        igdbScore: selectedGame.total_rating,
        igdbUrl: selectedGame.url,
        igdbGenres: selectedGame.genres,
      });
      toast.success(`Updated "${game.name}"`);
      onUpdated();
    } catch (e: any) {
      toast.error(`Error updating "${game.name}"`);
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    setResults([]);
    setSelectedGame(null);

    if (game) {
      doSearch(game.name);
    }
  }, [game]);

  return (
    <Modal
      open={!!game}
      onClose={onClose}
      aria-labelledby="search-igdb"
      aria-describedby="search-igdb"
    >
      <div className="modal-content">
        <h2>
          Searching IGDB for {game?.name}
          {(searching || saving) && (
            <CircularProgress className="ml-4" size={15} />
          )}
        </h2>
        {!searching && results.length === 0 && <p>No results found</p>}
        {!searching && results.length > 0 && (
          <>
            <Select
              value={selectedGame?.id}
              onChange={(e) => {
                setSelectedGame(
                  results.find((r) => r.id === e.target.value) || null
                );
              }}
            >
              {results.map((r) => (
                <MenuItem value={r.id}>{r.name}</MenuItem>
              ))}
            </Select>
            <Card className="my-4 p-3">
              <h3>{selectedGame?.name}</h3>
              <p className="text-sm text-gray-500">{selectedGame?.summary}</p>
              {selectedGame?.total_rating && (
                <p>Rating: {selectedGame?.total_rating}</p>
              )}
              {(selectedGame?.genres || []).length > 0 && (
                <p>Genres: {selectedGame?.genres.join(", ")}</p>
              )}
              <p>
                <a href={selectedGame?.url} target="_blank" rel="noreferrer">
                  {selectedGame?.url}
                </a>
              </p>
            </Card>
            <Button
              type="button"
              onClick={() => {
                doUpdate();
              }}
              disabled={saving}
            >
              Save
            </Button>
          </>
        )}
        <Button
          type="button"
          onClick={() => {
            onClose();
          }}
          disabled={saving}
        >
          Close
        </Button>
      </div>
    </Modal>
  );
};

export default SearchIGDBModal;
