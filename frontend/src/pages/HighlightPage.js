import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';

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
  const { id: paramId } = useParams(); // Fetch user ID from URL

  const [videos, setVideos] = useState([]);
  useEffect(() => {

    const fetchVideos = async () => {
      try {
        const response = await axios.get(`${apiBaseUrl}/api/videos`);
        if(paramId){
          const filteredVideos = response.data.filter(video => video.user._id === paramId);
          setVideos(filteredVideos);
        }
        else {
          setVideos(response.data);

        }
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    fetchVideos();
  }, []);



  return (
    <>
      <Helmet>
        <title> Dashboard: Blog | Minimal UI </title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Watch Highlights
          </Typography>
        </Stack>

        <Stack mb={5} direction="row" alignItems="center" justifyContent="space-between">
          <BlogPostsSearch posts={POSTS} />
          <BlogPostsSort options={SORT_OPTIONS} />
        </Stack>

        <Grid container spacing={3}>
          {videos.map((video, index) => (
            <BlogPostCard btnFor="h" key={video._id} videosrc={video.videoUrl} user={video.user} index={index} />
          ))}
        </Grid>
      </Container>
    </>
  );
}
