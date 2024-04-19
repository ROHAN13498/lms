# Use the official Node.js 14 image as a base
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./
COPY prisma ./prisma


# Install dependencies
RUN npm install


# Copy the rest of the application code to the working directory
COPY . .

# Expose the port the app runs on
EXPOSE 3000


CMD ["npm", "run", "dev:docker"]
