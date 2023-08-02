// const connectButton = document.getElementById("connectButton");
const videoElement = document.getElementById("videoElement");

// connectButton.textContent = "Join Live";
// connectButton.style.padding = "10px";
// connectButton.style.margin = "5px";
// connectButton.style.backgroundColor = "#4caf50"; 
// connectButton.style.color = "#ffffff";
// connectButton.style.border = "none";
// connectButton.style.borderRadius = "4px"; 

let socket;
// videoElement.setAttribute("autoplay", "");
// videoElement.setAttribute("playsinline", "");
// videoElement.style.transform = "scaleX(-1)"; 
// videoElement.style.width = "50%";

// Function to connect to the server and start receiving camera feed
function connectToServer() {
    console.log("Join Live button clicked!");
    //open coonection to Live server
    const socket = io('https://3.210.49.37:8000/')
    //open coonection to peer server
    const myPeer = new Peer(undefined, {
        host: '192.168.2.111',
        port: '3001',
        secure: true
        })
    myPeer.on('open', id => {
        socket.emit('JoinLive', ROOM_ID, id);
        })

    myPeer.on('call', call => {
        console.log('streaming')
        call.answer(null)
        const video = document.createElement('video')
        call.on('stream', liveStream => {
            videoElement.srcObject = liveStream;
        })
    })
}
connectToServer();
// connectButton.addEventListener("click", () => {
//   connectToServer();
// });
