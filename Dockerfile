FROM node:18-alpine

WORKDIR /app/server

# Copy package files
COPY server/package*.json ./

# Install dependencies with maximum compatibility
RUN npm install --legacy-peer-deps --no-optional --prefer-offline

# Copy tsconfig BEFORE source (so TS can find it)
COPY server/tsconfig.json ./

# Copy source code
COPY server/src ./src

# Build TypeScript
RUN npm run build

EXPOSE 5000

CMD ["npm", "start"]

