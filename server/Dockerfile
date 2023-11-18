FROM node:20-alpine

WORKDIR /usr/src/app

COPY package*.json  ./

RUN yarn

COPY . .

RUN yarn build

EXPOSE 8080/tcp

CMD [ "node", "dist/main.js" ]