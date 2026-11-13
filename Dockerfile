# Multi-stage build for Chess Puzzles App

# Stage 1: Build backend
FROM node:18 AS backend-build
WORKDIR /app/server
COPY server/package*.json ./
RUN npm ci --omit=dev
COPY server .
RUN npm run build

# Stage 2: Build frontend  
FROM node:18 AS frontend-build
WORKDIR /app/client
COPY client/package*.json ./
RUN npm ci
COPY client .
RUN npm run build

# Stage 3: Production runtime
FROM node:18
WORKDIR /app

# Copy backend dependencies and built files
COPY server/package*.json ./server/
WORKDIR /app/server
RUN npm ci --omit=dev
COPY --from=backend-build /app/server/dist ./dist

# Copy built frontend to public directory
COPY --from=frontend-build /app/client/build ./public

# Expose port
EXPOSE 5000

# Start backend
CMD ["npm", "start"]
