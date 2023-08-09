const socket = io('https://surajzinzuwadia.com:8001/')
// socket.emit('join-room', ROOM_ID, 10)

bSocketConnected = false;
bPeerConected = false;
let thisId = 1
const videoGrid = document.getElementById('video-grid')
const myPeer = new Peer(undefined, {
  host: 'surajzinzuwadia.com',
  port: '3003',
  secure: true
})
const myVideo = document.createElement('video')
myVideo.muted = true
const peers = {}
navigator.mediaDevices.getUserMedia({
  video: true,
  audio: true
}).then(stream => {
  addVideoStream(myVideo, stream,thisId)

  myPeer.on('call', call => {
    console.log('streaming')
    call.answer(stream)
    let peerId = call.peer
    const video = document.createElement('video')
    call.on('stream', (userVideoStream) => {
      addVideoStream(video, userVideoStream, peerId)
    })
  })

  socket.on('user-connected', userId => {
    connectToNewUser(userId, stream)
  })
})

socket.on('user-disconnected', userId => {
  if (peers[userId]) peers[userId].close()
  if(document.getElementById(userId)) 
  {
    ele = document.getElementById(userId)
    ele.parentElement.removeChild(ele)
  }
}) 

socket.on('connect', ()=>{
  bSocketConnected = true;
  if(bPeerConected){
    socket.emit('join-room', ROOM_ID, id)
  }
})
myPeer.on('open', id => {
  bPeerConected = true;
  thisId = id;
  if(bSocketConnected)
  {
    socket.emit('join-room', ROOM_ID, id)
  }
})

function connectToNewUser(userId, stream) {
  const call = myPeer.call(userId, stream)
  const video = document.createElement('video')

  call.on('stream', userVideoStream => {
    addVideoStream(video, userVideoStream, userId)
  })
  call.on('close', () => {
    video.remove()
  })

  peers[userId] = call
}

function addVideoStream(video, stream, userId) {
  video.srcObject = stream
  video.style.transform = "scaleX(-1)"; 
  video.id = userId
  // video.style.marginright = "10px"; 
  video.addEventListener('loadedmetadata', () => {
    video.play()
  })
  videoGrid.append(video)
}