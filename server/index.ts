import { Request, Response } from 'express';
import Game from './types/Game';
import SteamGame from './types/SteamGame';

require('dotenv').config()
const express = require('express')
const axios = require("axios")
const cors = require('cors')

const app = express()
const port = 3042
const { STEAM_ID, STEAM_API_KEY, CORS_ORIGIN } = process.env

if (!STEAM_ID || !STEAM_API_KEY || !CORS_ORIGIN) {
  throw Error('Please set up your .env files as described in the README.')
}

app.use(cors({
  origin: CORS_ORIGIN
}));

app.get('/library', async (req: Request, res: Response) => {
  const response = await axios.get(`http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${STEAM_API_KEY}&steamid=${STEAM_ID}&format=json&include_appinfo=true`)
  res.send(
    response.data.response.games.map((game: SteamGame): Game => ({
      id: game.appid,
      name: game.name,
      icon: game.img_icon_url ? `http://media.steampowered.com/steamcommunity/public/images/apps/${game.appid}/${game.img_icon_url}.jpg` : '',
      playtime: game.playtime_forever,
      lastPlayed: game.rtime_last_played,
    }))
  )
})

app.listen(port, () => {
  console.log(`Steam library server listening on port ${port}`)
})
