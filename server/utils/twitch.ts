import axios from "axios";
import { TwitchAuthResponse } from "types/Twitch";

export const doTwitchAuth = async (): Promise<TwitchAuthResponse> => {
  const { data } = await axios.post(
    `https://id.twitch.tv/oauth2/token?client_id=${process.env.TWITCH_CLIENT_ID}&client_secret=${process.env.TWITCH_CLIENT_SECRET}&grant_type=client_credentials`
  );

  return data as TwitchAuthResponse;
};
