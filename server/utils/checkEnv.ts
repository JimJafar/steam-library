const checkEnv = (): void => {
  const {
    STEAM_ID,
    STEAM_API_KEY,
    CORS_ORIGIN,
    TWITCH_CLIENT_ID,
    TWITCH_CLIENT_SECRET,
  } = process.env;

  if (
    !STEAM_ID ||
    !STEAM_API_KEY ||
    !CORS_ORIGIN ||
    !TWITCH_CLIENT_ID ||
    !TWITCH_CLIENT_SECRET
  ) {
    throw Error("Please set up your .env files as described in the README.");
  }
};

export default checkEnv;
