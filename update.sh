#!/usr/bin/env bash

docker-compose down
git add --all
git commit -m "update metadata"
git pull
git push
docker build -t steam-library:0.1.2 .
docker-compose up -d