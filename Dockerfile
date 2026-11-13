FROM node:18-alpine

WORKDIR /app

# Copy server folder
COPY server ./server

# Install dependencies
WORKDIR /app/server
RUN npm install --legacy-peer-deps

# Build with noEmit=false to output JS even with type errors
RUN npm run build

EXPOSE 5000

CMD ["npm", "start"]
