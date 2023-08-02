# Use the official Node.js image as the base image
FROM node:14

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json (if available) to the container
COPY package*.json ./

# Install the application dependencies
RUN npm install

# Copy all the application files to the container
COPY . .

# Expose the port on which the application will run (3001 as per your code)
EXPOSE 3001

# Start the Node.js application
CMD ["node", "index.js"]