FROM node:18-alpine

WORKDIR /app

# Copy everything
COPY . .

# Install and build
WORKDIR /app/server
RUN npm ci --only=production
RUN npm run build

EXPOSE 5000

CMD ["npm", "start"]
