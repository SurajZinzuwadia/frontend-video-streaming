const express = require("express");
const router = express.Router();
const VideoController = require("../controllers/VideoController");

// POST create a new video
router.post("/", VideoController.createVideo);

// GET all videos
router.get("/", VideoController.getAllVideos);

module.exports = router;
