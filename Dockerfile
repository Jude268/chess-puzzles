FROM node:18-slim

WORKDIR /app/server

# Copy package files
COPY server/package*.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Verify npm install worked
RUN ls -la node_modules | head -20 || echo "ERROR: node_modules is empty!"
RUN npm list --depth=0 || echo "ERROR: npm list failed!"

# Copy tsconfig
COPY server/tsconfig.json ./

# Copy source code
COPY server/src ./src

# Build TypeScript
RUN npm run build

EXPOSE 5000

CMD ["npm", "start"]
