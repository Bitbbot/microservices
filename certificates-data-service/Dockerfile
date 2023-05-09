FROM node:latest
WORKDIR /usr/src/certificate-data-service
COPY package*.json ./

RUN npm install
COPY . .

RUN npm run build

EXPOSE 3008

CMD ["node", "dist/index.js"]