import axios from "axios";
import {
  enrichWithIGDBMetadata,
  getGame,
  getGenres,
  getTimeToBeat,
} from "../utils/igdb";
import { writeLog } from "../utils/logging";
import { IGDBGame, IGDBGenre, IGDBTimeToBeat } from "../types/IGDB";
import Metadata from "../types/Metadata";
import { TwitchAuthResponse } from "../types/Twitch";

jest.mock("axios");
jest.mock("../utils/logging", () => ({
  writeLog: jest.fn(),
}));

const mockedAxios = axios as jest.Mocked<typeof axios>;
const mockedWriteLog = writeLog as jest.MockedFunction<typeof writeLog>;

describe("IGDB Utils", () => {
  const twitchAuth: TwitchAuthResponse = {
    access_token: "mock-token",
    expires_in: 3600,
    token_type: "bearer",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getGame", () => {
    it("should return game data when found", async () => {
      const mockGame = {
        id: 123,
        total_rating: 85,
        genres: [1, 2, 3],
        url: "https://igdb.com/games/test-game",
      } as IGDBGame;

      mockedAxios.post.mockResolvedValue({ data: [mockGame] });

      const result = await getGame("Test Game", twitchAuth);

      expect(mockedAxios.post).toHaveBeenCalledWith(
        "https://api.igdb.com/v4/games",
        'where name = "Test Game"; fields total_rating,genres,url; sort id asc;',
        expect.objectContaining({
          headers: {
            "Client-ID": process.env.TWITCH_CLIENT_ID,
            Authorization: "Bearer mock-token",
          },
        })
      );
      expect(result).toEqual(mockGame);
    });

    it("should return undefined when game is not found", async () => {
      mockedAxios.post.mockResolvedValue({ data: [] });

      const result = await getGame("Nonexistent Game", twitchAuth);

      expect(result).toBeUndefined();
      expect(mockedWriteLog).not.toHaveBeenCalled();
    });

    it("should handle errors", async () => {
      const error = new Error("API error");
      mockedAxios.post.mockRejectedValue(error);

      await expect(getGame("Error Game", twitchAuth)).rejects.toThrow();
      expect(mockedWriteLog).toHaveBeenCalledWith(
        "Error fetching IGDB game: API error"
      );
    });
  });

  describe("getTimeToBeat", () => {
    it("should return time to beat data when found", async () => {
      const mockTimeToBeat: IGDBTimeToBeat = {
        normally: 1000,
        hastily: 800,
        completely: 1500,
      };

      mockedAxios.post.mockResolvedValue({ data: [mockTimeToBeat] });

      const result = await getTimeToBeat(123, twitchAuth);

      expect(mockedAxios.post).toHaveBeenCalledWith(
        "https://api.igdb.com/v4/game_time_to_beats",
        "fields normally,hastily,completely;where game_id = 123;",
        expect.any(Object)
      );
      expect(result).toEqual(mockTimeToBeat);
    });

    it("should return undefined when time to beat data is not found", async () => {
      mockedAxios.post.mockResolvedValue({ data: [] });

      const result = await getTimeToBeat(456, twitchAuth);

      expect(result).toBeUndefined();
    });

    it("should handle errors", async () => {
      const error = new Error("API error");
      mockedAxios.post.mockRejectedValue(error);

      await expect(getTimeToBeat(789, twitchAuth)).rejects.toThrow();
      expect(mockedWriteLog).toHaveBeenCalledWith(
        "Error fetching IGDB time to beat: API error"
      );
    });
  });

  describe("getGenres", () => {
    it("should return genres data", async () => {
      const mockGenres: IGDBGenre[] = [
        { id: 1, name: "Action" },
        { id: 2, name: "Adventure" },
      ];

      mockedAxios.post.mockResolvedValue({ data: mockGenres });

      const result = await getGenres([1, 2], twitchAuth);

      expect(mockedAxios.post).toHaveBeenCalledWith(
        "https://api.igdb.com/v4/genres",
        "fields name; where id = (1,2);",
        expect.any(Object)
      );
      expect(result).toEqual(mockGenres);
    });

    it("should handle errors", async () => {
      const error = new Error("API error");
      mockedAxios.post.mockRejectedValue(error);

      await expect(getGenres([3, 4], twitchAuth)).rejects.toThrow();
      expect(mockedWriteLog).toHaveBeenCalledWith(
        "Error fetching IGDB genres: API error"
      );
    });
  });

  describe("enrichWithIGDBMetadata", () => {
    it("should enrich metadata with IGDB data", async () => {
      const mockGame = {
        id: 123,
        total_rating: 85,
        genres: [1, 2],
        url: "https://igdb.com/games/test-game",
      } as IGDBGame;

      const mockGenres: IGDBGenre[] = [
        { id: 1, name: "Action" },
        { id: 2, name: "Adventure" },
      ];

      const mockTimeToBeat: IGDBTimeToBeat = {
        normally: 1000,
        hastily: 800,
        completely: 1500,
      };

      const metadata = {
        steamAppId: "12345",
        steamName: "Test Game",
        steamDescription: "Test Description",
        steamImageUrl: "https://test.com/image.jpg",
      } as unknown as Metadata;

      mockedAxios.post.mockImplementation((url) => {
        if (url.includes("games")) return Promise.resolve({ data: [mockGame] });
        if (url.includes("genres"))
          return Promise.resolve({ data: mockGenres });
        if (url.includes("game_time_to_beats"))
          return Promise.resolve({ data: [mockTimeToBeat] });
        return Promise.reject(new Error("Unexpected URL"));
      });

      const result = await enrichWithIGDBMetadata(
        "Test Game",
        metadata,
        twitchAuth
      );

      expect(result).toEqual({
        ...metadata,
        igdbScore: 85,
        igdbUrl: "https://igdb.com/games/test-game",
        igdbGenres: ["Action", "Adventure"],
        igdbTimeToBeat: mockTimeToBeat,
      });
    });

    it("should return original metadata when game is not found", async () => {
      mockedAxios.post.mockResolvedValueOnce({ data: [] });

      const metadata: Metadata = {
        steamAppId: "12345",
        steamName: "Unknown Game",
        steamDescription: "Test Description",
        steamImageUrl: "https://test.com/image.jpg",
      } as unknown as Metadata;

      const result = await enrichWithIGDBMetadata(
        "Unknown Game",
        metadata,
        twitchAuth
      );

      expect(result).toEqual(metadata);
      expect(mockedWriteLog).toHaveBeenCalledWith(
        "IGDB metadata not found for Unknown Game"
      );
    });

    it("should handle errors and return original metadata", async () => {
      const error = new Error("API error");
      mockedAxios.post.mockRejectedValue(error);

      const metadata: Metadata = {
        steamAppId: "12345",
        steamName: "Error Game",
        steamDescription: "Test Description",
        steamImageUrl: "https://test.com/image.jpg",
      } as unknown as Metadata;

      const result = await enrichWithIGDBMetadata(
        "Error Game",
        metadata,
        twitchAuth
      );

      expect(result).toEqual(metadata);
      expect(mockedWriteLog).toHaveBeenCalledWith(
        "Error fetching IGDB metadata for Error Game: API error"
      );
    });
  });
});
