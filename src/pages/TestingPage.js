import { Helmet } from 'react-helmet-async';
import io from 'socket.io-client';

import React, { useState, useEffect, useRef } from 'react';
// @mui
import { Grid, Button, Container, Stack, Typography } from '@mui/material';
// components
import Iconify from '../components/iconify';
import { BlogPostCard, BlogPostsSort, BlogPostsSearch } from '../sections/@dashboard/blog';
// mock
import POSTS from '../_mock/blog';

// ----------------------------------------------------------------------

const SORT_OPTIONS = [
  { value: 'latest', label: 'Latest' },
  { value: 'popular', label: 'Popular' },
  { value: 'oldest', label: 'Oldest' },
];
export default function TestingPage() {
  const [openFilter, setOpenFilter] = useState(false);
  const [videoChunks, setVideoChunks] = useState([]);

  const videoRef = useRef(null);

  const handleOpenFilter = () => {
    setOpenFilter(true);
  };

  const handleCloseFilter = () => {
    setOpenFilter(false);
  };

  //   useEffect(() => {
  //     const socket = io('http://localhost:5000');

  //     socket.on('connect', () => {
  //       console.log('Connected to the server');

  //       // Request the static video from the server
  //       fetch('http://localhost:5000/video')
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

  //     return () => {
  //       socket.disconnect();
  //     };
  //   }, []);

  //   useEffect(() => {
  //     if (videoChunks.length > 0) {
  //       // Concatenate and create a Blob from the received video chunks
  //       const videoBlob = new Blob(videoChunks, { type: 'video/mp4' });
  //       const videoURL = URL.createObjectURL(videoBlob);

  //       // Update the video player source with the concatenated video
  //       const videoElement = videoRef.current;
  //       videoElement.src = videoURL;
  //     }
  //   }, [videoChunks]);

  return (
    <>
      {/* <div>
        <h1>Video Stream Client</h1>
        <video ref={videoRef} controls width="640" height="360">
          <source src="" type="video/mp4" />
          <track kind="captions" srcLang="en" label="English Captions" />
          Your browser does not support the video tag.
        </video>
      </div> */}
      <Helmet>
        <title> Dashboard: Blog | Minimal UI </title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Blog
          </Typography>
          <Button variant="contained" startIcon={<Iconify icon="eva:plus-fill" />}>
            Go Live
          </Button>
        </Stack>

        <Stack mb={5} direction="row" alignItems="center" justifyContent="space-between">
          <BlogPostsSearch posts={POSTS} />
          <BlogPostsSort options={SORT_OPTIONS} />
        </Stack>

        <Grid container spacing={3}>
          {POSTS.slice(0, 1).map((post, index) => (
            <BlogPostCard key={post.id} post={post} index={index} />
          ))}
        </Grid>
      </Container>
    </>
  );
}
