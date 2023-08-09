const https = require('https');
const express = require('express');
const fs = require('fs');
const cors = require('cors');
const dotenv = require('dotenv');

const app = express()
// var certificate  = fs.readFileSync("/app/backend/private.crt");
// var privateKey = fs.readFileSync("/app/backend/private.key");
var certificate  = fs.readFileSync("/app/certs/cert.pem");
var privateKey = fs.readFileSync("/app/certs/privkey.pem");


const corsOptions = {
  origin: [
    'https://192.168.2.112:3002',
    'https://192.168.2.112:3001',
    'https://192.168.2.112:3000'
  ],
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use(cors(corsOptions));

const server = https.createServer(
  {
    cert: certificate, 
    key: privateKey,
    // passphrase: 'dexter'

  },
  app
);

dotenv.config();



// const server = require('http').createServer(app);
const io = require('socket.io')(server);
const { v4: uuidV4 } = require('uuid');

const { PeerServer } = require('peer');
const peerServer = PeerServer({ port: 3002, 
  path: '/' ,
  ssl: {
      key: privateKey,
      cert: certificate,
      // passphrase: 'dexter'
    }
});

const groupServer = PeerServer({ port: 3003, 
  path: '/' ,
  ssl: {
      key: privateKey,
      cert: certificate,
      // passphrase: 'dexter'
    }
});
// const peerServer = PeerServer({ port: 3002, path: '/' });

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

app.get('/group/:room', (req, res) => {
  res.render('group', { roomId: req.params.room });
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
    if(!(socket.to(roomId).broadcast))
    {
      console.log('socket to this room id does not exist', roomId);
    }else
    {
      console.log("entered into user connected")
      socket.to(roomId).broadcast.emit('user-connected', userId);

    }
  });
  
});

const port = process.env.PORT || 8001;

server.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});