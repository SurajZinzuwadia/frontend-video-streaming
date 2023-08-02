import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
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
  top: 0,
  width: '100%',
  height: '100%',
});

// ----------------------------------------------------------------------

BlogPostCard.propTypes = {
  user: PropTypes.object.isRequired,
  index: PropTypes.number,
};

export default function BlogPostCard({ user, index }) {
  // const { cover, title, view, comment, share, author, createdAt } = post;
  // const { cover, title, view, comment, share, author, createdAt } = user;
    const { cover, title, videoUrl } = user;
  // const staticVideoURL = '../../../../public/assets/bunny.mp4';

  const latestPostLarge = index === 0;
  const latestPost = index === 1 || index === 2;
  const [videoChunks, setVideoChunks] = useState([]);
  const [isVideoView, setIsVideoView] = useState(false);

  const [isStreaming, setIsStreaming] = useState(false);
  const [isStart, setIsStart] = useState(true);

  const navigate = useNavigate();

  const handleStartStreaming = () => {
    setIsStreaming(true);
  };

  const handleStopStreaming = () => {
    setIsStreaming(false);
  };

  const handleSubscribe = async () => {
    try {
      const loggedUser = JSON.parse(localStorage.getItem('user'));
  
      // Check if the user is logged in
      if (!loggedUser) {
        // If not logged in, redirect to the login page
        navigate('/login');
        return;
      }
  
      // Make an API call to subscribe to the producer
      const response = await axios.post(`http://localhost:8000/api/subscriptions/${loggedUser._id}`, {
        producerId: user._id,
      });
  
      // If the subscription was added successfully, show a success message
      if (response.data.message === 'Subscription added successfully') {
        console.log('Successfully subscribed to the producer');
        // Add any additional logic or UI updates you want to show when the subscription is successful
      } else {
        console.log('Failed to subscribe to the producer');
        // Handle any error or show an error message if the subscription failed
      }
    } catch (error) {
      console.error('An error occurred while subscribing:', error);
      // Handle any error or show an error message if an error occurred while subscribing
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
            {/* <video ref={videoRef} width="100%" controls key={index}>
              <source src="" type="video/mp4" />
              <track kind="captions" srcLang="en" label="English Captions" />
              Your browser does not support the video tag.
            </video> */}
            <video width="100%" controls key={index}>
              <source src={`/${videoUrl}`} type="video/mp4" />
              <track kind="captions" srcLang="en" label="English Captions" />
              Your browser does not support the video tag.
            </video>
            
            <Button onClick={handleStopStreaming} variant="contained" color="error">
              Stop Streaming
            </Button>
          </>
            
          ) : (
            <>
            <StyledCardMedia
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
                {title}
              </StyledTitle>
              {/* <StyledCover alt={title} src={cover} /> */}
              <StyledCover alt='cover' src='/assets/images/covers/cover_1.jpg' />

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
              <Typography gutterBottom variant="caption" sx={{ color: 'text.disabled', display: 'block' }}>
                {/* {fDate(createdAt)} */}
                Date Created
              </Typography>

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
                {title}
              </StyledTitle>
              <StyledInfo>
                <Button 
                  onClick={handleSubscribe} variant="contained" color="inherit">
                  Subscribe
                </Button>
                <Button 
                  onClick={handleStartStreaming} variant="contained" color="primary">
                Watch Streaming
                </Button>
              </StyledInfo>

              
              {/* <StyledInfo>
                {POST_INFO.map((info, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      ml: index === 0 ? 0 : 1.5,
                      ...((latestPostLarge || latestPost) && {
                        color: 'grey.500',
                      }),
                    }}
                  >
                    <Iconify icon={info.icon} sx={{ width: 16, height: 16, mr: 0.5 }} />
                    <Typography variant="caption">{fShortenNumber(info.number)}</Typography>
                  </Box>
                ))}
              </StyledInfo> */}
               
            </CardContent>

            </>
            
          )}
        
      </Card>
    </Grid>
  );
}