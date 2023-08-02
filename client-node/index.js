const https = require('https');
const express = require('express')
const fs = require('fs');
const app = express();
const cors = require('cors');
const path = require('path');
var certificate  = fs.readFileSync("/Users/darshandave/MAC/sem3/Internship/video_streaming_platform/SSL_Certificates/liveStream_SSL/private.crt");
var privateKey = fs.readFileSync("/Users/darshandave/MAC/sem3/Internship/video_streaming_platform/SSL_Certificates/liveStream_SSL/private.key");
const corsOptions = {
  origin: ['https://3.210.49.37:3002', 'https://3.210.49.37:3002, https://3.210.49.37:8000'],
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use(cors(corsOptions));
const server = https.createServer(
  {
      cert: certificate, 
      key: privateKey,
      passphrase: 'dexter'
  },
  app
);

const io = require('socket.io')(server)
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