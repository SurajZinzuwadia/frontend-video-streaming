const https = require('https');
const express = require('express')
const fs = require('fs');
const cors = require('cors');
const path = require('path');
const app = express()
var certificate  = fs.readFileSync("/Users/krishnapatel/Desktop/Internship/Frontend-material/StreamSonic/backend/private.crt");
var privateKey = fs.readFileSync("/Users/krishnapatel/Desktop/Internship/Frontend-material/StreamSonic/backend/private.key");
const server = https.createServer(
  {
      cert: certificate, 
      key: privateKey,
      passphrase: 'dexter'
  },
  app
);
app.use(cors({ origin: 'https://192.168.2.111:3000' })); // Use the cors middleware with your React app's HTTPS URL
app.use(express.static(path.join(__dirname, '../frontend/build')));

const port = 3002; // Use the port provided by the environment or 3000 as default

// Serve static files from the "build" directory

// For any other route, serve the React app
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
});

// Start the server
server.listen(port, () => {
  console.log(`Server running on http://localhost:${port}/`);
});