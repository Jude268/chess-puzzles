FROM node:18-alpine

WORKDIR /app

# Copy only package files first
COPY server/package*.json ./server/

# Copy source code and tsconfig
COPY server/src ./server/src
COPY server/tsconfig.json ./server/

# Install and build in server directory
WORKDIR /app/server
RUN npm ci --only=production
RUN npm run build

EXPOSE 5000

CMD ["npm", "start"]
