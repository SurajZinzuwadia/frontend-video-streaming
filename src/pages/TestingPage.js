import { Helmet } from 'react-helmet-async';
import io from 'socket.io-client';

import React, { useState, useEffect, useRef } from 'react';
import { Grid, Button, Container, Stack, Typography } from '@mui/material';

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
  const [isStreaming, setIsStreaming] = useState(false);
  const [videoChunks, setVideoChunks] = useState([]);

  const videoRef = useRef(null);
  const socketRef = useRef(null);

  const handleStartStreaming = () => {
    setIsStreaming(true);
  };

  const handleStopStreaming = () => {
    setIsStreaming(false);
  };

  useEffect(() => {
   
    // Establish the socket connection when transitioning to video view
    const socket = io('http://localhost:5001');

    socket.on('connect', () => {
      console.log('Connected to the server');

      // Request the static video from the server
      fetch('http://localhost:5001/video')
        .then((response) => response.blob())
        .then((videoBlob) => {
          const videoURL = URL.createObjectURL(videoBlob);

          // Set the video URL to the video player
          const videoElement = videoRef.current;
          videoElement.src = videoURL;
        })
        .catch((error) => {
          console.error('Error fetching video:', error);
        });

      socket.on('video-chunk', (chunk) => {
        // Store the video chunk in the state
        setVideoChunks((prevChunks) => [...prevChunks, chunk]);
      });
    });

    // Return a cleanup function to disconnect the socket when component unmounts or transitioning to card view
    return () => {
      socket.disconnect();
    };
  
}, [isStreaming]);


    useEffect(() => {
      if (videoChunks.length > 0) {
        // Concatenate and create a Blob from the received video chunks
        const videoBlob = new Blob(videoChunks, { type: 'video/mp4' });
        const videoURL = URL.createObjectURL(videoBlob);
  
        // Update the video player source with the concatenated video
        const videoElement = videoRef.current;
        if (videoElement) {
          videoElement.src = videoURL;
        }
      }
    }, [isStreaming]);

  return (
    <>
      <Helmet>
        <title> Dashboard: Blog | Minimal UI </title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Live Broadcast
          </Typography>
          <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />}>
            Go Live
          </Button>
        </Stack>

        <Stack mb={5} direction="row" alignItems="center" justifyContent="space-between">
          <BlogPostsSearch posts={POSTS} />
          <BlogPostsSort options={SORT_OPTIONS} />
        </Stack>
        <div>

          {isStreaming ? (
            <>
        <video ref={videoRef} controls width="640" height="360">
          <source src="" type="video/mp4" />
          <track kind="captions" srcLang="en" label="English Captions" />
          Your browser does not support the video tag.
        </video>
            <Button onClick={handleStopStreaming} variant="contained" color="error">
              Stop Streaming
            </Button>
            </>
            
          ) : (
            <Button onClick={handleStartStreaming} variant="contained" color="primary">
              Start Streaming
            </Button>
          )}
        </div>
      </Container>
    </>
  );
}
