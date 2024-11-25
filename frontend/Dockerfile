# Use the official Node.js image as the base image
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock)
COPY frontend/package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY frontend/ .

# Build the Next.js application
RUN npm run build

# Expose port 3000
EXPOSE 4000

# Start the Next.js application
CMD ["npm", "start"]
