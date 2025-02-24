import axios from "axios";
import { TwitchAuthResponse } from "types/Twitch";
import { writeLog } from "./logging";

export const doTwitchAuth = async (): Promise<TwitchAuthResponse> => {
  try {
    writeLog("Authenticating with Twitch");
    const { data } = await axios.post(
      `https://id.twitch.tv/oauth2/token?client_id=${process.env.TWITCH_CLIENT_ID}&client_secret=${process.env.TWITCH_CLIENT_SECRET}&grant_type=client_credentials`
    );

    return data as TwitchAuthResponse;
  } catch (e: any) {
    writeLog(`Error fetching Twitch auth: ${e.message || ""}`);
    throw e;
  }
};
