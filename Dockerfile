FROM node:18-alpine

WORKDIR /app

# Copy server files only
COPY server ./server

# Install and build server
WORKDIR /app/server
RUN npm install --legacy-peer-deps
RUN npm run build

EXPOSE 5000

CMD ["npm", "start"]
