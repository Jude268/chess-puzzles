FROM node:18-alpine

WORKDIR /app/server

# Copy package files
COPY server/package*.json ./

# Install ALL dependencies (including devDependencies for TypeScript compilation)
RUN npm install --legacy-peer-deps

# Copy source and build files
COPY server/src ./src
COPY server/tsconfig.json ./

# Compile TypeScript to JavaScript
RUN npm run build

# Expose port
EXPOSE 5000

# Start the application
CMD ["npm", "start"]
