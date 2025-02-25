import checkEnv from "../utils/checkEnv";

describe("checkEnv", () => {
  // Store the original environment
  const originalEnv = process.env;

  beforeEach(() => {
    // Create a clean environment for each test
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    // Restore the original environment
    process.env = originalEnv;
  });

  it("should not throw an error when all required env vars are present", () => {
    // Set all required environment variables
    process.env.STEAM_ID = "test-steam-id";
    process.env.STEAM_API_KEY = "test-steam-api-key";
    process.env.CORS_ORIGIN = "test-cors-origin";
    process.env.TWITCH_CLIENT_ID = "test-twitch-client-id";
    process.env.TWITCH_CLIENT_SECRET = "test-twitch-client-secret";

    expect(() => checkEnv()).not.toThrow();
  });

  it("should throw an error when STEAM_ID is missing", () => {
    process.env.STEAM_API_KEY = "test-steam-api-key";
    process.env.CORS_ORIGIN = "test-cors-origin";
    process.env.TWITCH_CLIENT_ID = "test-twitch-client-id";
    process.env.TWITCH_CLIENT_SECRET = "test-twitch-client-secret";
    delete process.env.STEAM_ID;

    expect(() => checkEnv()).toThrow(
      "Please set up your .env files as described in the README."
    );
  });

  it("should throw an error when STEAM_API_KEY is missing", () => {
    process.env.STEAM_ID = "test-steam-id";
    process.env.CORS_ORIGIN = "test-cors-origin";
    process.env.TWITCH_CLIENT_ID = "test-twitch-client-id";
    process.env.TWITCH_CLIENT_SECRET = "test-twitch-client-secret";
    delete process.env.STEAM_API_KEY;

    expect(() => checkEnv()).toThrow();
  });

  it("should throw an error when CORS_ORIGIN is missing", () => {
    process.env.STEAM_ID = "test-steam-id";
    process.env.STEAM_API_KEY = "test-steam-api-key";
    process.env.TWITCH_CLIENT_ID = "test-twitch-client-id";
    process.env.TWITCH_CLIENT_SECRET = "test-twitch-client-secret";
    delete process.env.CORS_ORIGIN;

    expect(() => checkEnv()).toThrow();
  });

  it("should throw an error when TWITCH_CLIENT_ID is missing", () => {
    process.env.STEAM_ID = "test-steam-id";
    process.env.STEAM_API_KEY = "test-steam-api-key";
    process.env.CORS_ORIGIN = "test-cors-origin";
    process.env.TWITCH_CLIENT_SECRET = "test-twitch-client-secret";
    delete process.env.TWITCH_CLIENT_ID;

    expect(() => checkEnv()).toThrow();
  });

  it("should throw an error when TWITCH_CLIENT_SECRET is missing", () => {
    process.env.STEAM_ID = "test-steam-id";
    process.env.STEAM_API_KEY = "test-steam-api-key";
    process.env.CORS_ORIGIN = "test-cors-origin";
    process.env.TWITCH_CLIENT_ID = "test-twitch-client-id";
    delete process.env.TWITCH_CLIENT_SECRET;

    expect(() => checkEnv()).toThrow();
  });
});
