import scrapeSteam from "../utils/scrapeSteam";
import SteamGame from "../types/SteamGame";
import { writeLog } from "../utils/logging";
import axios from "axios";

jest.mock("../utils/logging", () => ({
  writeLog: jest.fn(),
}));

describe("scrapeSteam", () => {
  const mockGame = {
    appid: 123,
    name: "Test Game",
  } as SteamGame;

  it("should return metadata for a valid game", async () => {
    const metadata = await scrapeSteam(mockGame);
    expect(metadata).toBeDefined();
  });

  it("should handle age gate", async () => {
    jest.spyOn(axios, "get").mockRejectedValue(new Error("Age gate hit"));
    await expect(scrapeSteam(mockGame)).rejects.toThrow("Age gate hit");
  });

  it("should handle errors during onDeck parsing", async () => {
    jest.spyOn(axios, "get").mockResolvedValue({
      data: '<div id="application_config" data-deckcompatibility="invalid json"></div>',
    });
    await scrapeSteam(mockGame);
    expect(writeLog).toHaveBeenCalled();
  });
});
