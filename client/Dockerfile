FROM node:12-alpine

ENV CI=true

WORKDIR /app

COPY package.json .

RUN yarn install

COPY . .

CMD ["npm", "start"]

