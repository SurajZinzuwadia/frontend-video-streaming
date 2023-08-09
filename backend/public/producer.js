
  let bLive = false;
  let socket = null;
  var videoElement = document.createElement("video");
  videoElement.setAttribute("autoplay", "");
  videoElement.setAttribute("playsinline", "");
  videoElement.style.transform = "scaleX(-1)"; 
  videoElement.style.width = "100%";
  videoElement.style.transition = "transform 0.8s";

  // Create the flip button
  var flipButton = document.createElement("button");
  flipButton.textContent = "Flip Camera";
  flipButton.style.padding = "10px";
  flipButton.style.margin = "5px";
  flipButton.style.backgroundColor = "#4caf50";
  flipButton.style.color = "#fff";
  flipButton.style.border = "none";
  flipButton.style.borderRadius = "4px";
  flipButton.style.display = 'none';

  // Create the go live button
  var goLiveButton = document.createElement("button");
  goLiveButton.textContent = "Go Live";
  goLiveButton.style.margin = "5px";
  goLiveButton.style.padding = "10px";
  goLiveButton.style.backgroundColor = "#f44336";
  goLiveButton.style.color = "#fff";
  goLiveButton.style.border = "none";
  goLiveButton.style.borderRadius = "4px";

  // Access the user's camera stream

  function accessCamera() {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then(function (stream) {
        videoElement.srcObject = stream;
        document.body.appendChild(videoElement);
      })
      .catch(function (error) {
        console.log("Error accessing camera stream:", error);
        // Display more information about the error
        console.log("Error name:", error.name);
        console.log("Error message:", error.message);
        console.log("Error constraint:", error.constraint);
      });
  }
  

  // Flip the camera
  function flipCamera() {
    var videoTracks = videoElement.srcObject.getVideoTracks();
    var facingMode = videoTracks[0].getSettings().facingMode;

    videoElement.style.transform = "scaleX(1)"; 
    videoElement.offsetHeight;
    videoTracks[0].stop();

    var newFacingMode = facingMode === "user" ? "environment" : "user";

    var constraints = { video: { facingMode: newFacingMode } };

    // Access the new camera stream
    navigator.mediaDevices
      .getUserMedia(constraints)
      .then(function (stream) {
        videoElement.srcObject = stream;

        // Apply mirror effect for front camera
        if (newFacingMode === "user") {
          videoElement.style.transform = "scaleX(-1)";
        } else {
          videoElement.style.transform = "scaleX(1)";
        }
      })
      .catch(function (error) {
        console.error("Error accessing camera stream:", error);
      });
  }

  let myPeer = null;
  function endLive()
  {
  
   let keys = Object.keys(peers)
   for(var i =0; i < keys.length; i++)
   {
    if (peers[keys[i]]) peers[keys[i]].close()
   }
   if(socket)
   {
    socket.emit('disconnect')
   }
  
  window.location.href = `https://www.surajzinzuwadia.com/api/users/${ROOM_ID}/disable-live`;
  
  }
  // Function for "Go Live" button
  function goLive() {
      console.log("Go Live button clicked!");
      // const serverUrl = process.env.SERVER_URL || 'http://localhost:8000'; // Replace 'http://localhost:8000' with your actual server URL
      //open coonection to Live server
      socket = io('https://surajzinzuwadia.com:8001/')
      //open coonection to peer server
      myPeer = new Peer(undefined, {
          host: 'surajzinzuwadia.com',
          port: '3002',
          secure: true
          })
      myPeer.on('open', id => {
          socket.emit('GoLive', ROOM_ID, id)
          })

    navigator.mediaDevices
      .getUserMedia({ video: true , audio:true})
      .then((stream) => {
          // addVideoStream(myVideo, stream)

          myPeer.on('call', call => {
              console.log('streaming Live!!')
              call.answer(stream)
              // const video = document.createElement('video')
          })
          socket.on('user-connected', userId => {
              connectToNewUser(userId, stream)
          })
          socket.on('user-disconnected', userId => {
            if (peers[userId]) peers[userId].close()
        }) 
      })
  }
  let peers = {};



  function connectToNewUser(userId, stream) {
      const call = myPeer.call(userId, stream)
      // const video = document.createElement('video')
      // call.on('stream', userVideoStream => {
      //   addVideoStream(video, userVideoStream)
      // })
      // call.on('close', () => {
      //   video.remove()
      // })
      peers[userId] = call
    }

  // Add event listeners to buttons
  flipButton.addEventListener("click", flipCamera);
  goLiveButton.addEventListener("click", LiveClicked);

  function LiveClicked()
  {
    if(bLive)
    {
      bLive = false;
      goLiveButton.textContent = "Go Live";
      endLive();

    }else{
      bLive = true;
      goLiveButton.textContent = "End Live";
      goLive();
    }
  }
  // Access the camera stream initially
  accessCamera();

  // Append video element and buttons to the body
  document.body.appendChild(videoElement);
  document.body.appendChild(flipButton);
  document.body.appendChild(goLiveButton);

