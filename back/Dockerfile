FROM node:latest

WORKDIR /app

RUN mkdir /transcendence_nest_server/

COPY . /app/transcendence_nest_server/

WORKDIR /app/transcendence_nest_server

RUN npm install

CMD ["npm","run","start:dev"]