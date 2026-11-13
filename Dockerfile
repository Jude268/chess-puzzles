FROM node:18-slim

WORKDIR /app/server

COPY server/package*.json ./

RUN npm install --legacy-peer-deps

COPY server/tsconfig.json ./
COPY server/src ./src

RUN npm run build

EXPOSE 5000

CMD ["npm", "start"]
