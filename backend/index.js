const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const app = express();

const corsOptions = {
  origin: [
    'https://192.168.2.112:3002',
    'https://192.168.2.112:3001',
    'https://192.168.2.112:3000'
  ],
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use(cors(corsOptions));
dotenv.config();

var certificate  = fs.readFileSync("/app/certs/cert.pem");
var privateKey = fs.readFileSync("/app/certs/privkey.pem ");

const server = https.createServer(
  {
      cert: certificate, 
      key: privateKey,
  },
  app
);
// const server = require('http').createServer(app);
const io = require('socket.io')(server);
const { v4: uuidV4 } = require('uuid');

const { PeerServer } = require('peer');
const peerServer = PeerServer({ port: 3002, path: '/' });

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.redirect(`/${uuidV4()}`);
});

app.get('/:room', (req, res) => {
  res.render('indexP', { roomId: req.params.room });
});

app.get('/j/:room', (req, res) => {
  console.log(req.params.room);
  res.render('indexC', { roomId: req.params.room });
});

app.get('/join/:room', (req, res) => {
  res.render('room', { roomId: req.params.room });
});

io.on('connection', socket => {
  socket.on('GoLive', (roomId, userId) => {
    console.log('Live Room Created roomId:', roomId, "by User userid: ", userId);
    socket.join(roomId);

    socket.on('disconnect', () => {
      socket.to(roomId).broadcast.emit('Live-disconnected', userId);
    });
  });

  socket.on('JoinLive', (roomId, userId) => {
    console.log('Live user connected:', roomId, userId);
    socket.join(roomId);
    socket.to(roomId).broadcast.emit('user-connected', userId);
  });
});

const port = process.env.PORT || 8000;

server.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});