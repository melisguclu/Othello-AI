FROM node:20-alpine

WORKDIR /app

RUN npm install -g serve

COPY package.json package-lock.json ./

RUN npm install

COPY . .

RUN npm run build

CMD [ "serve", "-s", "dist" ]