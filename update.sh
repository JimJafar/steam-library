#!/usr/bin/env bash

docker-compose down
gaa
gcmsg "update metadata"
gl
gp
docker build -t steam-library:0.1.2 .
docker-compose up -d