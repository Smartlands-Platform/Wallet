FROM node:8
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm i npm@latest -g
RUN npm install
COPY . .
RUN npm run build

EXPOSE 3000
ENTRYPOINT npm run server
