FROM node:latest
WORKDIR /usr/src/suppliers-service
COPY package*.json ./

RUN npm install
COPY . .

RUN npm run build

EXPOSE 50051

CMD ["node", "dist/main.js"]