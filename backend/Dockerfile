# Use official Node.js image as the base image
FROM node:14

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

RUN npm install cors

# Copy the rest of the application code
COPY . .

# Expose the port your app runs on
ENV PORT = 3000

# Command to run the application
CMD ["node", "server.js"]
