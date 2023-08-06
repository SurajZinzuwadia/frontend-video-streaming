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
    // const serverUrl = process.env.SERVER_URL || 'http://localhost:8000'; // Replace 'http://localhost:8000' with your actual server URL

    //open coonection to Live server
    const socket = io('3.210.49.3:8001/')
    //open coonection to peer server
    const myPeer = new Peer(undefined, {
        host: '3.210.49.37',
        port: '3002',
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
