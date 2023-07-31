// const express = require('express');
// const http = require('http');
// const socketIo = require('socket.io');

// const app = express();
// const server = http.createServer(app);
// const io = socketIo(server);

// // Broadcast the video stream to connected clients
// let videoStream = null;

// io.on('connection', (socket) => {
//   console.log('A new client connected');

//   if (videoStream) {
//     socket.emit('video-stream', videoStream);
//   }

//   socket.on('disconnect', () => {
//     console.log('A client disconnected');
//   });
// });

// // Route to receive the video stream from the source (e.g., a camera)
// app.post('/stream', (req, res) => {
//   req.on('data', (chunk) => {
//     // Broadcast the video stream to all connected clients
//     videoStream = chunk;
//     io.emit('video-stream', chunk);
//   });

//   req.on('end', () => {
//     res.end('Stream received');
//   });
// });

// const port = 5000;
// server.listen(port, () => {
//   console.log(`Server running on http://localhost:${port}`);
// });
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const multer = require('multer');
const fs = require('fs');
const cors = require('cors');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Set up multer to handle file uploads
const upload = multer({ dest: 'uploads/' });

app.use(cors());

let videoStream = null; // Declare the videoStream variable to store video data

// Socket.IO middleware to handle streaming video data
io.on('connection', (socket) => {
  console.log('A new client connected');

  if (videoStream) {
    // Emit the video stream data when a new client connects
    socket.emit('video-stream', videoStream);
  }

  socket.on('disconnect', () => {
    console.log('A client disconnected');
  });
});

// Route to receive the video file and start broadcasting its data to connected clients
app.post('/stream', upload.single('video'), (req, res) => {
  const videoPath = req.file.path;

  // Clear the previous video stream data when a new video is uploaded
  videoStream = null;

  // Read the video file and send its data to connected clients
  const readStream = fs.createReadStream(videoPath);

  readStream.on('data', (chunk) => {
    // Store video chunks in the videoStream variable
    if (!videoStream) {
      videoStream = chunk;
    } else {
      videoStream = Buffer.concat([videoStream, chunk]);
    }

    // Emit the video chunk to all connected clients
    io.emit('video-chunk', chunk);
  });

  readStream.on('end', () => {
    console.log('Video streaming complete');
    res.json({ message: 'Video stream started' });
  });

  readStream.on('error', (err) => {
    console.error('Error reading video file:', err);
    res.status(500).json({ error: 'Error reading video file' });
  });
});

app.get('/video', (req, res) => {
  const videoPath = path.join(__dirname, '../../../sample-5s.mp4');

  // Read the video file and send its data to the client
  const readStream = fs.createReadStream(videoPath);
  readStream.on('data', (chunk) => {
    // Emit the video chunk to all connected clients
    io.emit('video-chunk', chunk);
  });

  readStream.on('end', () => {
    console.log('Video streaming complete');
  });

  readStream.on('error', (err) => {
    console.error('Error reading video file:', err);
    res.status(500).json({ error: 'Error reading video file' });
  });
});

const port = 5000;
server.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
