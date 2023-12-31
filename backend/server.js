const https = require('https');
const express = require('express')
const fs = require('fs');
const cors = require('cors');

const app = express()
var certificate  = fs.readFileSync("/Users/darshandave/MAC/sem3/Internship/video_streaming_platform/SSL_Certificates/liveStream_SSL/private.crt");
var privateKey = fs.readFileSync("/Users/darshandave/MAC/sem3/Internship/video_streaming_platform/SSL_Certificates/liveStream_SSL/private.key");
const corsOptions = {
  origin: ['https://192.168.2.112:3002', 'https://192.168.2.112:3001, https://192.168.2.112:3000'],
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use(cors(corsOptions));const server = https.createServer(
  {
      cert: certificate, 
      key: privateKey,
      passphrase: 'dexter'
  },
  app
);
const io = require('socket.io')(server)
io.origins(['https://192.168.2.112:3002','https://192.168.2.112:3000','https://192.168.2.112:3001']);
const { v4: uuidV4 } = require('uuid')



const { PeerServer } = require('peer');
const peerServer = PeerServer({ port: 3001, 
                            path: '/' ,
                            ssl: {
                                key: privateKey,
                                cert: certificate,
                                passphrase: 'dexter'
                              }
                        });

app.set('view engine', 'ejs')
app.use(express.static('public'))

app.get('/', (req, res) => {
  // console.log("hello 1");
  res.redirect(`/${uuidV4()}`)
})

app.get('/:room', (req, res) => {
  res.render('indexP', { roomId: req.params.room })
})

app.get('/j/:room', (req, res) => {
  console.log(req.params.room )
  res.render('indexC', { roomId: req.params.room })
})


app.get('/join:room', (req, res) => {
  // console.log("hello 2");
  // console.log("room id = ", req.params.room );

  res.render('room', { roomId: req.params.room })
})

io.on('connection', socket => {
  socket.on('GoLive', (roomId, userId) => {
    console.log('Live Room Created roomId:',roomId, "by User userid: ",userId);
    socket.join(roomId)
    // socket.to(roomId).broadcast.emit('Live-started', userId)

    socket.on('disconnect', () => {
      socket.to(roomId).broadcast.emit('Live-disconnected', userId)
    })

  })
  socket.on('JoinLive', (roomId, userId) => {
    console.log('Live user connected :',roomId, userId);
    socket.join(roomId);
    socket.to(roomId).broadcast.emit('user-connected', userId);
  })
})

server.listen(3000)