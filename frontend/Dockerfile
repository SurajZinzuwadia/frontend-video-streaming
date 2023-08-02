FROM node:14

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Build the React app
RUN npm run build

EXPOSE 3000
# Set the command to start the React app
CMD ["npx", "serve", "-s", "-l", "3000", "build"]