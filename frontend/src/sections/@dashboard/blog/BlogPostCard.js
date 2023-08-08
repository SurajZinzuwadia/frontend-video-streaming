import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Peer from 'peerjs';
import PropTypes from 'prop-types';
// @mui
import { useNavigate } from 'react-router-dom';

import { alpha, styled } from '@mui/material/styles';
import { Box, Link, Card, Grid, Avatar, Typography, CardContent, Button } from '@mui/material';
// utils
import { fDate } from '../../../utils/formatTime';
import { fShortenNumber } from '../../../utils/formatNumber';
//
import SvgColor from '../../../components/svg-color';
import Iconify from '../../../components/iconify';
// ----------------------------------------------------------------------

const StyledCardMedia = styled('div')({
  position: 'relative',
  paddingTop: 'calc(100% * 3 / 4)',
});

const StyledTitle = styled(Link)({
  height: 44,
  overflow: 'hidden',
  WebkitLineClamp: 2,
  display: '-webkit-box',
  WebkitBoxOrient: 'vertical',
  marginBottom: '16px'
});

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  zIndex: 9,
  width: 32,
  height: 32,
  position: 'absolute',
  left: theme.spacing(3),
  bottom: theme.spacing(-2),
}));

const StyledInfo = styled('div')(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'space-between',
  marginTop: theme.spacing(1),
  color: theme.palette.text.disabled,
}));

const StyledCover = styled('img')({
  top: 0,
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  position: 'absolute',
});

const StyledVideo = styled('video')({
  width: '100%',
  height: '100%',
  position: 'relative',
});


// ----------------------------------------------------------------------

BlogPostCard.propTypes = {
  user: PropTypes.object.isRequired,
  index: PropTypes.number,
};

// Function to connect to the server and start receiving camera feed


export default function BlogPostCard({ user, index, btnFor, videosrc }) {
  const loggedUser = JSON.parse(localStorage.getItem('user'));

  const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;
  const apiSocketUrl = process.env.REACT_APP_API_SOCKET_URL;

  // const { cover, title, view, comment, share, author, createdAt } = post;
  // const { cover, title, view, comment, share, author, createdAt } = user;
    // const { cover, title, videoUrl, user } = videoData;
  // const staticVideoURL = '../../../../public/assets/bunny.mp4';
  
  // function connectToServer() {
  //   console.log("Join Live button clicked!");
  //   const socket = io('192.168.2.112:3000/')
  //   const myPeer = new Peer(undefined, {
  //       host: '192.168.2.112',
  //       port: '3001',
  //       secure: true
  //       })

  //   myPeer.on('open', id => {
  //       socket.emit('JoinLive', loggedUser._id, id);
  //   })
  
  //   myPeer.on('call', call => {
  //       console.log('streaming');
  //       // call.answer(stream)
  //       const video = document.createElement('video');
  //       call.on('stream', liveStream => {
  //           video.srcObject = liveStream;
  //       })
  //   })
  // }

  // const latestPostLarge = index === 0;
  // const latestPost = index === 1 || index === 2;
  const [singleUser, setSingleUser] = useState({});
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const loggedUser = JSON.parse(localStorage.getItem('user'));
      if (!loggedUser) {
        // If not logged in, redirect to the login page
        navigate('/login');
        return;
      }
      try {
        const response = await fetch(`${apiBaseUrl}/api/users/${user?._id}`);
        if (!response.ok) {
          throw new Error('User not found');
        }
        const data = await response.json();
        setSingleUser(data.user);
        const isUserSubscribed = loggedUser.subscribed.includes(user?._id);
        console.log(isUserSubscribed)
        setIsSubscribed(isUserSubscribed);
      } catch (error) {
        console.error('Fetch user error:', error);
      }
    };

    fetchUser();
  }, [user]);
  const latestPostLarge = 1;
  const latestPost = 1;
  const [videoChunks, setVideoChunks] = useState([]);
  const [isVideoView, setIsVideoView] = useState(false);

  const [isStreaming, setIsStreaming] = useState(false);
  const [isStart, setIsStart] = useState(true);

  const navigate = useNavigate();

  const handleStartStreaming = () => {
    setIsStreaming(true);
    const url = `${apiSocketUrl}/j/${user._id}`;
    window.open(url, "_blank");
  };
  const handleHightStreaming = () => {
    setIsStreaming(true);

  };
  const handleStopStreaming = () => {
    setIsStreaming(false);
  };

  const handleSubscribe = async () => {
    try {
  
      // Check if the user is logged in
      if (!loggedUser) {
        // If not logged in, redirect to the login page
        navigate('/login');
        return;
      }

      // Make an API call to subscribe to the producer
      const response = await axios.post(`${apiBaseUrl}/api/subscriptions/${loggedUser._id}`, {
        producerId: singleUser._id,
      });
  
      // If the subscription was added successfully, show a success message
      if (response.data.message === 'Subscription added successfully') {
        setIsSubscribed(true);
        toast.success('Successfully subscribed!', {
          position: toast.POSITION.BOTTOM_CENTER,
        });
      } else {
        toast.error('Failed to subscribe. Please try again.', {
          position: toast.POSITION.BOTTOM_CENTER,
        });

      }
    } catch (error) {
      console.error('An error occurred while subscribing:', error);
      const errorMessage =
        error.response && error.response.data && error.response.data.error
          ? error.response.data.error
          : 'An error occurred while subscribing. Please try again later.';
      toast.error(errorMessage, {
        position: toast.POSITION.BOTTOM_CENTER,
      });
    }
  };
  
//   useEffect(() => {
   
//     // Establish the socket connection when transitioning to video view
//     const socket = io('http://localhost:5001');

//     socket.on('connect', () => {
//       console.log('Connected to the server');

//       // Request the static video from the server
//       fetch('http://localhost:5001/video')
//         .then((response) => response.blob())
//         .then((videoBlob) => {
//           const videoURL = URL.createObjectURL(videoBlob);

//           // Set the video URL to the video player
//           const videoElement = videoRef.current;
//           videoElement.src = videoURL;
//         })
//         .catch((error) => {
//           console.error('Error fetching video:', error);
//         });

//       socket.on('video-chunk', (chunk) => {
//         // Store the video chunk in the state
//         setVideoChunks((prevChunks) => [...prevChunks, chunk]);
//       });
//     });

//     // Return a cleanup function to disconnect the socket when component unmounts or transitioning to card view
//     return () => {
//       socket.disconnect();
//     };
  
// }, [isStreaming]);
// useEffect(() => {
//   if (videoChunks.length > 0) {
//     // Concatenate and create a Blob from the received video chunks
//     const videoBlob = new Blob(videoChunks, { type: 'video/mp4' });
//     const videoURL = URL.createObjectURL(videoBlob);

//     // Update the video player source with the concatenated video
//     const videoElement = videoRef.current;
//     if (videoElement) {
//       videoElement.src = videoURL;
//     }
//   }
// }, [videoChunks, isStreaming]);
  const videoRef = useRef(null);

  const handleClick = () => {
    // Toggle the state when the title is clicked
    setIsVideoView((prevIsVideoView) => !prevIsVideoView);
  };
  return (
    <Grid item xs={12} sm={latestPostLarge ? 12 : 6} md={latestPostLarge ? 6 : 3}>
      <Card sx={{ position: 'relative' }}>
          {isStreaming ? (
            <>

            <StyledVideo  controls key={index}>
              <source src={`/${videosrc}`} type="video/mp4" />
              <track kind="captions" srcLang="en" label="English Captions" />
              Your browser does not support the video tag.
            </StyledVideo>
            
            
            <Button onClick={handleStopStreaming} variant="contained" color="error">
              Stop Streaming
            </Button>

         
          </>
          ) : (
            <>
              <StyledCardMedia
              key={user._id}
                sx={{
                  ...((latestPostLarge || latestPost) && {
                    pt: 'calc(100% * 4 / 3)',
                    '&:after': {
                      top: 0,
                      content: "''",
                      width: '100%',
                      height: '100%',
                      position: 'absolute',
                      bgcolor: (theme) => alpha(theme.palette.grey[900], 0.72),
                    },
                  }),
                  ...(latestPostLarge && {
                    pt: {
                      xs: 'calc(100% * 4 / 3)',
                      sm: 'calc(100% * 3 / 4.66)',
                    },
                  }),
                }}
              >
                <SvgColor
                  color="paper"
                  src="/assets/icons/shape-avatar.svg"
                  sx={{
                    width: 80,
                    height: 36,
                    zIndex: 9,
                    bottom: -15,
                    position: 'absolute',
                    color: 'background.paper',
                    ...((latestPostLarge || latestPost) && { display: 'none' }),
                  }}
                />
                <StyledAvatar
                  alt={user.name}
                  src={user.avatarUrl}
                  sx={{
                    ...((latestPostLarge || latestPost) && {
                      zIndex: 9,
                      top: 24,
                      left: 24,
                      width: 40,
                      height: 40,
                    }),
                  }}
                />
                <StyledTitle
                  color="inherit"
                  variant="subtitle2"
                  underline="hover"
                  onClick={handleClick}
                  sx={{
                    ...(latestPostLarge && { typography: 'h5', height: 60 }),
                    ...((latestPostLarge || latestPost) && {
                      color: 'common.white',
                    }),
                  }}
                >
                  {user.name}'s Live Stream
                </StyledTitle>
                {/* <StyledCover alt={title} src={cover} /> */}
                <StyledCover alt='cover' src={`/assets/images/covers/cover_${index+1}.jpg`} />

              </StyledCardMedia>
              <CardContent
                sx={{
                  pt: 4,
                  ...((latestPostLarge || latestPost) && {
                    bottom: 0,
                    width: '100%',
                    position: 'absolute',
                  }),
                }}
              >
                <StyledTitle
                  color="inherit"
                  variant="subtitle2"
                  underline="hover"
                  onClick={handleClick}
                  sx={{
                    ...(latestPostLarge && { typography: 'h5', height: 60 }),
                    ...((latestPostLarge || latestPost) && {
                      color: 'common.white',
                    }),
                  }}
                >
                  {btnFor === 'h' ? `${user.name }'s Hightlight`: `${user.name}'s Live Stream`}
                </StyledTitle>
                <StyledInfo>
                  {isSubscribed ? (
                    <Button variant="contained" color="inherit" disabled>
                      Subscribed
                    </Button>
                  ) : (
                    <Button onClick={handleSubscribe} variant="contained" color="inherit">
                      Subscribe
                    </Button>
                  )}
                  <Button 
                    onClick={btnFor === 'h' ? handleHightStreaming: handleStartStreaming} variant="contained" color="primary">
                      {btnFor === 'h' ? 'Watch Highlight': 'Watch Live'}
                  </Button>
                </StyledInfo>
              </CardContent>
            </>
            
          )}
        
      </Card>
      <ToastContainer />

    </Grid>
  );
}
