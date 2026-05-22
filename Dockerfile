# Use official Node image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all project files
COPY . .

# Expose the port Vite uses
EXPOSE 5173

# Default command: start Vite dev server
CMD ["npx", "vite", "dev", "--host"]
