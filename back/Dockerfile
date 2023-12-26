FROM node:latest

WORKDIR /app

RUN mkdir /transcendence_nest_server/

COPY . /app/transcendence_nest_server/

WORKDIR /app/transcendence_nest_server

RUN npm install

RUN npx prisma generate

RUN npm run build

ENTRYPOINT ["sh", "-c", "npx prisma migrate deploy && npm run start"]

# ENTRYPOINT ["sh", "-c", "npx prisma migrate deploy && npm run start:dev"]