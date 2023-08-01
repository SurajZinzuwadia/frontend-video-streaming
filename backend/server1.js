const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const fs = require('fs');
const cors = require('cors');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
    allowedHeaders: ['my-custom-header'],
    credentials: true,
  },
});

app.use(cors());

const videoPath = path.join(__dirname, './testing.mp4');
const chunkSize = 5 * 1000; // 5 seconds (in milliseconds)
let isStreaming = false; // Variable to track streaming status

io.on('connection', (socket) => {
  console.log('A new client connected');

  let currentPosition = 0;

  const readChunk = () => {
    fs.readFile(videoPath, (err, data) => {
      if (err) {
        console.error('Error reading video file:', err);
        return;
      }

      const start = currentPosition;
      const end = Math.min(start + chunkSize, data.length);
      const videoChunk = data.slice(start, end);

      currentPosition = end >= data.length ? 0 : end;

      socket.emit('video-chunk', videoChunk);

      if (isStreaming && currentPosition === 0) {
        // Restart the loop when reaching the end of the video and streaming is active
        setTimeout(readChunk, 5000); // Send data in every 2 seconds
      } else if (isStreaming) {
        // Continue reading and sending chunks
        setImmediate(readChunk);
      }
    });
  };

  socket.on('start-streaming', () => {
    console.log('Client started streaming');
    isStreaming = true;
    readChunk(); // Start sending chunks
  });

  socket.on('stop-streaming', () => {
    console.log('Client stopped streaming');
    isStreaming = false;
  });

  socket.on('disconnect', () => {
    console.log('A client disconnected');
  });
});

const port = 5001;
server.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
