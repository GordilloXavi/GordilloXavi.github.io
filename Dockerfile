# Use a base image with Node.js
FROM node:22

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY ./app .

# Expose port 3000 (or the port your app runs on)
EXPOSE 5173

# Command to run the app
CMD ["npx", "vite", "--host", "127.0.0.1"]
