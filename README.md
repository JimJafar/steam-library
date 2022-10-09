# steam-library

A quick and dirty app to list out your Steam library using the Valve API

# Getting started

Make a copy of `.env.example` named `.env` and replace `XXX` with your 
[Steam API key](https://steamcommunity.com/dev/apikey) and your 
[Steam ID](https://thedroidguy.com/how-to-find-your-steam-id-1155178).

# Running locally for development

In two terminal windows:

`npm run start:dev:server`

and 

`npm run start:dev:client`

The server will be running on port `3042` and the UI will be on `3000`.

# Running in production

Update `client/.env.prod` with the address the server will be accessible at on your production host.
Update `server/.env.prod` with your Steam API key and ID plus the same address you set for the client.

Run `docker build -t steam-library:0.1 .` to build your Docker image.

Now you can start the app with `docker-compose up`.

The server will be running on port `3042` and the UI will be on `5142`.
