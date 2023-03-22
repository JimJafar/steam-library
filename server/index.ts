import { Request, Response } from 'express'
import bodyParser from 'body-parser'
import cheerio from 'cheerio'
import express from 'express'
import cors from 'cors'
import axios from 'axios'
import dotenv from 'dotenv'
import fs from 'fs'
import metadata from './metadata.json'
import SteamGame from './types/SteamGame'
import ReviewScore from './types/Metadata'
import mergeMetadata from './utils/mergeScores'
import parseSteamGames from './utils/parseSteamGames'
import delay from './utils/delay'
import Metadata from './types/Metadata'

dotenv.config()

const app = express()
const port = 3042
const { STEAM_ID, STEAM_API_KEY, CORS_ORIGIN } = process.env

if (!STEAM_ID || !STEAM_API_KEY || !CORS_ORIGIN) {
  throw Error('Please set up your .env files as described in the README.')
}

app.use(cors({
  origin: CORS_ORIGIN,
  optionsSuccessStatus: 200 // legacy browsers
}))

app.use(bodyParser.urlencoded({ extended: true }))

app.get('/library', async (req: Request, res: Response) => {
  const response = await axios.get(`http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${STEAM_API_KEY}&steamid=${STEAM_ID}&format=json&include_appinfo=true`)
  res.send(
    mergeMetadata(
      parseSteamGames(response.data.response.games),
      metadata
    )
  )
})

app.post('/update-metadata', async (req: Request, res: Response) => {
  const gamesResponse = await axios.get(`http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${STEAM_API_KEY}&steamid=${STEAM_ID}&format=json&include_appinfo=true`)
  const games: SteamGame[] = gamesResponse.data.response.games
  const updatePromises: Promise<void>[] = games.map(async (game: SteamGame) => {
    if (req.body.forceAll || !metadata.some((meta: Metadata) => meta.id === game.appid)) {
      try {
        const steamPage = await axios.get(
          `https://store.steampowered.com/app/${game.appid}`,
          {
            headers: {
              USER_AGENT: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36'
            }
          }
        )
        const $ = cheerio.load(steamPage.data)
        const metacriticScore = $('#game_area_metascore > div.score').first()?.text()
        const metacriticLink = $('#game_area_metalink > a').first()?.attr("href")
        const steamScoreParts = $('#review_histogram_rollup_section .game_review_summary')
          .attr('data-tooltip-html')
          ?.split(' user')[0]
          ?.split('% of the ');
        const onMac: boolean = !!$('div.game_area_purchase_platform span.platform_img mac')
        const onDeck = $('span.deckverified_CompatibilityDetailRatingDescription__2HWJ').first()?.text() || ''

        metadata.push({
          id: game.appid,
          metacriticUrl: metacriticLink || '',
          metacriticScore: parseInt(metacriticScore) || 0,
          steamScore: steamScoreParts ? parseInt(steamScoreParts[0], 10) : 0,
          steamReviewCount: steamScoreParts ? parseInt(steamScoreParts[1].replace(',', ''), 10) : 0,
          onMac,
          onDeck,
        })
      } catch(e: any) {
        console.error(`${game.name} failed: ${e.message}`)
      }

      await delay(500)
    }
  })

  await Promise.all(updatePromises)

  fs.writeFileSync('./metadata.json', JSON.stringify(metadata, undefined, 2), {
    encoding: 'utf8',
    flag: 'w'
  })

  res.send(mergeMetadata(parseSteamGames(games), metadata))
})

app.listen(port, () => {
  console.log(`Steam library server listening on port ${port} and allowing connections from ${CORS_ORIGIN}`)
})
