# Stage 1: Build the application
FROM node:18-alpine AS builder

WORKDIR /usr/src/app

# Copy and install dependencies
COPY package*.json ./
RUN npm install --production && npm install @nestjs/cli && npm cache clean --force

# Copy source code and build the application
COPY . .
RUN npm run build

# Stage 2: Run the application
FROM node:18-alpine

WORKDIR /usr/src/app

# Copy the built app and necessary files from builder
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY package*.json ./

# Expose port
EXPOSE 3001

# Start the application
CMD ["node", "dist/main"]
