FROM node:latest
WORKDIR /usr/src/supplier-management-app
COPY package*.json ./

RUN npm install
COPY . .

RUN npm run build

EXPOSE 3100

CMD ["node", "dist/main.js"]