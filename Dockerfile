FROM node:18

RUN npm config set cache /tmp --global
RUN npm install -g serve
