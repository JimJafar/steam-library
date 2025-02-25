import React, { FC } from "react";
import { Button } from "@mui/material";
import { Search } from "@mui/icons-material";
import Field from "../../types/Field";
import Game from "../../types/Game";
import formatLastPlayed from "../../utils/formatLastPlayed";
import formatPlaytime from "../../utils/formatPlaytime";
import GameIcon from "../GameIcon";
import OnDeckIcon from "../OnDeckIcon";
import secondsToHoursAndMinutes from "../../utils/secondsToHours";

export type GameTableProps = {
  onSort: (field: Field) => void;
  onSearchGame: (game: Game) => void;
  games: Game[];
};

const GameTable: FC<GameTableProps> = ({ onSearchGame, onSort, games }) => {
  return (
    <table>
      <thead>
        <tr>
          <th>&nbsp;</th>
          <th onClick={() => onSort(Field.name)}>name</th>
          <th onClick={() => onSort(Field.playtime)} className="hide-on-mobile">
            playtime
          </th>
          <th
            onClick={() => onSort(Field.lastPlayed)}
            className="hide-on-mobile"
          >
            played
          </th>
          <th onClick={() => onSort(Field.steamScore)}>Steam</th>
          <th onClick={() => onSort(Field.metacriticScore)}>MC</th>
          <th onClick={() => onSort(Field.igdbScore)}>IGDB</th>
          <th onClick={() => onSort(Field.igdbTimeToBeat)}>Beat</th>
          <th>Genres</th>
          <th onClick={() => onSort(Field.onMac)}>Mac</th>
          <th onClick={() => onSort(Field.onDeck)}>Deck</th>
          <th>Search</th>
        </tr>
      </thead>
      <tbody>
        {games.map((game) => (
          <tr key={game.id}>
            <td>{game.icon && <GameIcon game={game} />}</td>
            <td>
              <a
                href={`https://store.steampowered.com/app/${game.id}`}
                target="_blank"
                rel="noreferrer"
              >
                {game.name}
              </a>
            </td>
            <td className="hide-on-mobile">{formatPlaytime(game)}</td>
            <td className="hide-on-mobile nowrap">{formatLastPlayed(game)}</td>
            <td>
              {game.steamScore ? (
                <div className="with-tooltip">
                  {game.steamScore}%
                  <span className="tooltip">
                    {`${game.steamReviewCount!.toLocaleString(
                      "en-GB"
                    )} reviews`}
                  </span>
                </div>
              ) : (
                ""
              )}
            </td>
            <td>
              {game.metacriticUrl ? (
                <a href={game.metacriticUrl} target="_blank" rel="noreferrer">
                  {game.metacriticScore}
                </a>
              ) : (
                ""
              )}
            </td>
            <td>
              {game.igdbUrl ? (
                <a href={game.igdbUrl} target="_blank" rel="noreferrer">
                  {Math.round(game.igdbScore || 0)}
                </a>
              ) : (
                ""
              )}
            </td>
            <td>
              {game.igdbTimeToBeat ? (
                <div className="with-tooltip">
                  {secondsToHoursAndMinutes(game.igdbTimeToBeat.normally)}
                  <span className="tooltip">
                    {`Hastily: ${secondsToHoursAndMinutes(
                      game.igdbTimeToBeat.hastily
                    )}`}
                    <br />
                    {`Normally: ${secondsToHoursAndMinutes(
                      game.igdbTimeToBeat.normally
                    )}`}
                    <br />
                    {`Completely: ${secondsToHoursAndMinutes(
                      game.igdbTimeToBeat.completely
                    )}`}
                  </span>
                </div>
              ) : (
                ""
              )}
            </td>
            <td className="hide-on-mobile">
              {(game.igdbGenres || []).length > 0 && game.igdbGenres![0]}
              {(game.igdbGenres || []).length > 1 && (
                <span className="with-tooltip">
                  <strong> +{game.igdbGenres!.length - 1}</strong>
                  <span className="tooltip">
                    {game.igdbGenres!.slice(1).join(", ")}
                  </span>
                </span>
              )}
            </td>
            <td>
              {game.onMac && (
                <img
                  className="table-icon"
                  src="icon_platform_mac.png"
                  alt="Mac icon"
                />
              )}
            </td>
            <td>{game.onDeck && <OnDeckIcon supportLevel={game.onDeck} />}</td>
            <td className="p-2">
              <Button onClick={() => onSearchGame(game)}>
                <Search />
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default GameTable;
