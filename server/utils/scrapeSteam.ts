import axios from "axios";
import Metadata from "types/Metadata";
import { decode } from "html-entities";
import { load } from "cheerio";
import { writeLog } from "./logging";
import SteamGame from "types/SteamGame";

const scrapeSteam = async (game: SteamGame): Promise<Metadata> => {
  const steamPage = await axios.get(
    `https://store.steampowered.com/app/${game.appid}`,
    {
      headers: {
        USER_AGENT:
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36",
        Cookie:
          "lastagecheckage=1-January-1982; wants_mature_content=1; birthtime=378691201;",
      },
      withCredentials: true,
    }
  );
  const $ = load(steamPage.data);
  if ($("#ageYear").length > 0) {
    throw new Error("Age gate hit");
  }
  const metacriticScore = $("#game_area_metascore > div.score").first()?.text();
  const metacriticLink = $("#game_area_metalink > a").first()?.attr("href");
  const steamScoreParts = $(
    "#review_histogram_rollup_section .game_review_summary"
  )
    .attr("data-tooltip-html")
    ?.split(" user")[0]
    ?.split("% of the ");
  const onMac: boolean =
    $("div.game_area_purchase_platform span.platform_img.mac").length > 0;
  let onDeck = $("div#application_config")
    .first()
    .attr("data-deckcompatibility");

  try {
    switch (JSON.parse(decode(onDeck || "") || "{}").resolved_category) {
      case 1:
        onDeck = "Unsupported";
      case 2:
        onDeck = "Playable";
        break;
      case 3:
        onDeck = "Verified";
        break;
      default:
        onDeck = "";
    }
  } catch (e: any) {
    writeLog(`Error parsing onDeck for ${game.name} ${e?.message || ""}`);
  }

  return {
    id: game.appid,
    metacriticUrl: metacriticLink || "",
    metacriticScore: parseInt(metacriticScore) || 0,
    steamScore: steamScoreParts ? parseInt(steamScoreParts[0], 10) : 0,
    steamReviewCount: steamScoreParts
      ? parseInt(steamScoreParts[1].replace(",", ""), 10)
      : 0,
    onMac,
    onDeck: onDeck || "",
  };
};

export default scrapeSteam;
