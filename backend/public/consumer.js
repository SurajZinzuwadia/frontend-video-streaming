const connectButton = document.getElementById("connectButton");
const videoElement = document.getElementById("videoElement");

connectButton.textContent = "Join Live";
connectButton.style.padding = "10px";
connectButton.style.margin = "5px";
connectButton.style.backgroundColor = "#4caf50"; 
connectButton.style.color = "#ffffff";
connectButton.style.border = "none";
connectButton.style.borderRadius = "4px"; 
let bConnected = false;
let socket;
let callSocket;
// videoElement.setAttribute("autoplay", "");
// videoElement.setAttribute("playsinline", "");
// videoElement.style.transform = "scaleX(-1)"; 
// videoElement.style.width = "50%";

// Function to connect to the server and start receiving camera feed
function connectToServer() {
    let socket;
    if(!bConnected)
    {
    bConnected = true;
    console.log("Join Live button clicked!");
    // const serverUrl = process.env.SERVER_URL || 'http://localhost:8000'; // Replace 'http://localhost:8000' with your actual server URL

    //open conection to Live server
    socket = io('https://surajzinzuwadia.com:8001/')
    //open coonection to peer server
    const myPeer = new Peer(undefined, {
        host: 'surajzinzuwadia.com',
        port: '3002',
        secure: true
        })
    myPeer.on('open', id => {
        socket.emit('JoinLive', ROOM_ID, id);
        socket.on('user-disconnected', id => {
            console.log("User Disconneted received")
                if(ROOM_ID == id)
                {
                    console.log("Producer User Disconneted")
                    if(callSocket)callSocket.close();
                    if(socket)socket.emit('disconnect')
                    window.location.href = "https://www.surajzinzuwadia.com";
                }
            }) 
        })

    myPeer.on('call', call => {
        console.log('streaming')
        callSocket = call;
        call.answer(null)
        const video = document.createElement('video')
        call.on('stream', liveStream => {
            videoElement.srcObject = liveStream;
        })
    })
    } else { // disconnected clicked by consumer
        if(socket)
        {
            socket.emit('disconnect')
        }
        window.location.href = "https://www.surajzinzuwadia.com";
    }
}
// connectToServer();
connectButton.addEventListener("click", () => {
    if(bConnected){
        connectButton.textContent = "End Stream";      
    }else{
        connectButton.textContent = "Join Stream";      
    }
  connectToServer();
});
