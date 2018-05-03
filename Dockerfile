FROM node:6
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

EXPOSE 3000
ENTRYPOINT npm run server