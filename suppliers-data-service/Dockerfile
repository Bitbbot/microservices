FROM node:latest
WORKDIR /usr/src/supplier-data-service
COPY package*.json ./

RUN npm install
COPY . .

RUN npm run build

EXPOSE 3007

CMD ["node", "dist/main.js"]