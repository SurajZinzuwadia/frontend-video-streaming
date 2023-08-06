# Use the official Node.js 14 base image
FROM node:14

# Set the working directory in the container
WORKDIR /app

# Copy the package.json and package-lock.json to the container
# COPY package*.json ./

# Copy your application files to the container
COPY . ./backend

RUN mkdir -p /app/certs

# Copy the package.json and package-lock.json to the container
COPY package*.json ./backend/

WORKDIR /app/backend
# Install application dependencies
RUN npm install
RUN npm install peerjs
RUN npm install nodemon
RUN npm install fs

COPY /root/certificates/cert.pem /app/certs/
COPY /root/certificates/privkey.pem /app/certs/
# Decrypt the private key
# RUN openssl rsa -in /app/backend/private.key -out /app/backend/private_decrypted.key -passin pass:dexter

# Set appropriate permissions for the decrypted private key
# RUN chmod 600 /app/backend/private_decrypted.key

# Expose the necessary ports

# Build the application (if needed)
#RUN npm run build

# Expose the port on which your application listens
EXPOSE 8000

# Start the Node.js application
CMD ["node", "index.js"]
