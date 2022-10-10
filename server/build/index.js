"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = 3042;
const { STEAM_ID, STEAM_API_KEY, CORS_ORIGIN } = process.env;
console.log(process.env);
if (!STEAM_ID || !STEAM_API_KEY || !CORS_ORIGIN) {
    throw Error('Please set up your .env files as described in the README.');
}
app.use((0, cors_1.default)({
    origin: CORS_ORIGIN,
    optionsSuccessStatus: 200 // legacy browsers
}));
app.get('/library', async (req, res) => {
    const response = await axios_1.default.get(`http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${STEAM_API_KEY}&steamid=${STEAM_ID}&format=json&include_appinfo=true`);
    res.send(response.data.response.games.map((game) => ({
        id: game.appid,
        name: game.name,
        icon: game.img_icon_url ? `http://media.steampowered.com/steamcommunity/public/images/apps/${game.appid}/${game.img_icon_url}.jpg` : '',
        playtime: game.playtime_forever,
        lastPlayed: game.rtime_last_played,
    })));
});
app.listen(port, () => {
    console.log(`Steam library server listening on port ${port} and allowing connections from ${CORS_ORIGIN}`);
});
