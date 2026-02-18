# Use official Node.js imagebased on alpine for a smaller image size
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Install PM2 globally
RUN npm install -g pm2 cors

# Copy the rest of the application code
COPY . .

# Expose the port your app runs on
ENV port=3000

# Command to run the application
CMD ["pm2-runtime", "server.js"]
