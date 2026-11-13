# Multi-stage build for Chess Puzzles App

# Stage 1: Build backend
FROM node:18-alpine AS backend-build
WORKDIR /app/server
COPY server/package*.json ./
RUN npm install
COPY server .
RUN npm run build

# Stage 2: Build frontend
FROM node:18-alpine AS frontend-build
WORKDIR /app/client
COPY client/package*.json ./
RUN npm install
COPY client .
RUN npm run build

# Stage 3: Production runtime
FROM node:18-alpine
WORKDIR /app

# Install backend dependencies
COPY server/package*.json ./server/
WORKDIR /app/server
RUN npm install --production

# Copy built backend
COPY --from=backend-build /app/server/dist ./dist
COPY server/src ./src

# Copy built frontend
WORKDIR /app
COPY --from=frontend-build /app/client/build ./client/build

# Set working directory to server for startup
WORKDIR /app/server

# Expose ports
EXPOSE 5000

# Start the backend server
CMD ["npm", "start"]
