FROM node:18-alpine

WORKDIR /app

# Copy only package files first
COPY server/package*.json ./server/

# Install only production dependencies
WORKDIR /app/server
RUN npm ci --only=production

# Copy source code
COPY server/src ./src
COPY server/tsconfig.json ./

# Build TypeScript
RUN npm run build

WORKDIR /app/server

EXPOSE 5000

CMD ["npm", "start"]
