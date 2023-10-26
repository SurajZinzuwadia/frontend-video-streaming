import { Helmet } from 'react-helmet-async';
import io from 'socket.io-client';
import axios from 'axios';
import Peer from 'peerjs';
import { v4 as uuidv4 } from 'uuid';
import React, { useState, useEffect, useRef } from 'react';
import {
  Grid,
  Button,
  Container,
  Stack,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';

// Components
import Iconify from '../components/iconify';
import { BlogPostCard, BlogPostsSort, BlogPostsSearch } from '../sections/@dashboard/blog';
// Mock Data
import POSTS from '../_mock/blog';

const SORT_OPTIONS = [
  { value: 'latest', label: 'Latest' },
  { value: 'popular', label: 'Popular' },
  { value: 'oldest', label: 'Oldest' },
];

export default function TestingPage() {
  const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;

  const [isStreaming, setIsStreaming] = useState(false);
  const [users, setUsers] = useState([]);
  // eslint-disable-next-line
  const [videos, setVideos] = useState([]);

  const videoRef = useRef(null);
  const [openModal, setOpenModal] = useState(false);
  const [stream, setStream] = useState(null);
  const [myPeer, setMyPeer] = useState(null);
  const [peers, setPeers] = useState({});
  const loggedUser = JSON.parse(localStorage.getItem('user'));

  const handleOpenModal = async () => {
    try {
      const response = await axios.put(`${apiBaseUrl}/api/users/${loggedUser._id}`, { isLive: true });
      console.log(response);
    } catch (error) {
      console.error('Error fetching users:', error);
    }

    // const url = `${apiBaseUrl}/backend`;
    const url = `https://surajzinzuwadia.com:8001/${loggedUser._id}`;

    window.open(url, '_blank');
  };

  const handleCloseModal = () => {
    // Stop the media stream when the modal is closed
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
      if (myPeer) {
        myPeer.destroy();
        setMyPeer(null);
      }
      setPeers({});
    }
    setOpenModal(false);
  };

  const handleStartStreaming = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });

      setStream(stream);
      setIsStreaming(true);

      // Open connection to Live server
      const socket = io('wss://3.210.49.37:8001/');

      // Open connection to peer server
      const myPeer = new Peer(undefined, {
        host: '3.210.49.37',
        port: '3002',
        secure: true,
      });
      myPeer.on('open', (id) => {
        const ROOM_ID = uuidv4(); // Generate ROOM_ID
        console.log('WebSocket connection established:', socket.connected); // Add this line

        socket.emit('GoLive', ROOM_ID, id);
      });
      setMyPeer(myPeer);

      myPeer.on('call', (call) => {
        console.log('streaming Live!!');
        call.answer(stream);
      });

      socket.on('user-connected', (userId) => {
        console.log('User Connected!!', userId);

        connectToNewUser(userId, stream);
      });

      socket.on('user-disconnected', (userId) => {
        if (peers[userId]) peers[userId].close();
      });
    } catch (error) {
      console.error('Error accessing camera:', error);
      // Handle any error related to camera access
    }
  };

  const handleStopStreaming = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);

      // Close peer connections and other cleanup tasks
      if (myPeer) {
        myPeer.destroy();
        setMyPeer(null);
      }
      // Clear peers and any other necessary cleanup
      setPeers({});
    }
  };

  const connectToNewUser = (userId, stream) => {
    const call = myPeer.call(userId, stream);
    const video = document.createElement('video');
    call.on('stream', (userVideoStream) => {
      addVideoStream(video, userVideoStream);
    });
    call.on('close', () => {
      video.remove();
    });
    setPeers((prevPeers) => ({
      ...prevPeers,
      [userId]: call,
    }));
  };

  const addVideoStream = (video, stream) => {
    video.srcObject = stream;
    video.addEventListener('loadedmetadata', () => {
      video.play();
    });
    videoRef.current.appendChild(video);
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${apiBaseUrl}/api/users/list-users`);
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    fetchUsers();
    const fetchVideos = async () => {
      try {
        const response = await axios.get(`${apiBaseUrl}/api/videos`);
        console.log(response.data);
        setVideos(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    fetchVideos();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (stream && videoRef.current) {
      videoRef.current.srcObject = stream;
    }
    console.log(videoRef);
  }, [stream]);
  useEffect(() => {
    // Fetch user data and update isLive status every 15 seconds
    const fetchLiveStatus = async () => {
      try {
        const response = await axios.get(`${apiBaseUrl}/api/users/list-users`);
        const liveUsers = response.data.filter((user) => user.isLive);
        setUsers(liveUsers);
        console.log(liveUsers);
      } catch (error) {
        console.error('Error fetching live users:', error);
      }
    };

    // Fetch live status immediately and start the interval
    fetchLiveStatus();
    const intervalId = setInterval(fetchLiveStatus, 5000); // 5000 ms = 5 seconds

    // Clear the interval when the component unmounts
    return () => clearInterval(intervalId);
    // eslint-disable-next-line
  }, []);

  return (
    <>
      <Helmet>
        <title> Dashboard: Blog | Stream Sonic </title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Live Streaming
          </Typography>
          <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />} onClick={handleOpenModal}>
            Go Live
          </Button>

          {/* Modal */}
          <Dialog open={openModal} onClose={handleCloseModal}>
            <DialogTitle>Preview</DialogTitle>
            <DialogContent>
              {stream ? (
                <video ref={videoRef} width="100%" autoPlay playsInline>
                  <track kind="captions" srcLang="en" label="English Captions" />
                </video>
              ) : (
                <Typography variant="body1">Camera access not available.</Typography>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseModal} color="primary">
                Cancel
              </Button>
              {isStreaming ? (
                <Button onClick={handleStopStreaming} variant="contained" color="primary">
                  Stop Streaming
                </Button>
              ) : (
                <Button onClick={handleStartStreaming} variant="contained" color="primary">
                  Start Streaming
                </Button>
              )}
            </DialogActions>
          </Dialog>
        </Stack>

        <Stack mb={5} direction="row" alignItems="center" justifyContent="space-between">
          <BlogPostsSearch posts={POSTS} />
          <BlogPostsSort options={SORT_OPTIONS} />
        </Stack>

        <Grid container spacing={3}>
          {users
            .filter((user) => user.isLive)
            .map((user, index) => (
              <BlogPostCard key={user._id} user={user} index={index} />
            ))}
        </Grid>
      </Container>
    </>
  );
}
