# Use Node.js version 18.17.0 as the base image
FROM node:18.17.0

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Build the Vite application
RUN npm run build

# Expose the port that the Vite application will run on
EXPOSE 3000

# Command to run the application
CMD ["npm", "run", "dev"]
