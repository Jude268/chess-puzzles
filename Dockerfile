FROM node:18

WORKDIR /app

# Copy all files
COPY . .

# Install server dependencies only
WORKDIR /app/server
RUN npm install --production

# Build server
RUN npm run build

# Go back to root and copy built frontend (if it exists)
WORKDIR /app

# Expose port
EXPOSE 5000

# Start server
WORKDIR /app/server
CMD ["npm", "start"]
