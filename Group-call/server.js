const https = require('https');
const express = require('express')
const fs = require('fs');
const app = express()
var certificate  = fs.readFileSync("/Users/darshandave/MAC/sem3/Internship/video_streaming_platform/SSL_Certificates/liveStream_SSL/private.crt");
var privateKey = fs.readFileSync("/Users/darshandave/MAC/sem3/Internship/video_streaming_platform/SSL_Certificates/liveStream_SSL/private.key");
const server = https.createServer(
  {
      cert: certificate, 
      key: privateKey,
      passphrase: 'dexter'
  },
  app
);
const io = require('socket.io')(server)
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
  // console.log("hello 2");
  // console.log("room id = ", req.params.room );

  res.render('room', { roomId: req.params.room })
})

io.on('connection', socket => {
  socket.on('join-room', (roomId, userId) => {
     console.log('user connected :',roomId, userId);
    socket.join(roomId)
    socket.to(roomId).broadcast.emit('user-connected', userId)

    socket.on('disconnect', () => {
      socket.to(roomId).broadcast.emit('user-disconnected', userId)
    })
  })
})

server.listen(3000)