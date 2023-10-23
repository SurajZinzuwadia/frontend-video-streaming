const Video = require("../models/videoModel");
const User = require("../models/userModel");

// Create a new video
async function createVideo(req, res) {
  const { user, videoUrl, title, description } = req.body;

  try {
    const newVideo = new Video({
      user,
      videoUrl,
      title,
      description,
    });

    const savedVideo = await newVideo.save();

    res
      .status(201)
      .json({ message: "Video added successfully", video: savedVideo });
  } catch (error) {
    console.error("Error adding video:", error);
    res.status(500).json({ error: "Server error" });
  }
}

// Get all videos
async function getAllVideos(req, res) {
  try {
    const videos = await Video.find();

    // Fetch user details for each video
    const userIds = videos.map((video) => video.user);
    const users = await User.find({ _id: { $in: userIds } });

    const userMap = {};
    users.forEach((user) => {
      userMap[user._id] = user;
    });

    const videosWithUser = videos.map((video) => ({
      ...video.toObject(),
      user: userMap[video.user],
    }));

    res.status(200).json(videosWithUser);
  } catch (error) {
    console.error("Error fetching videos:", error);
    res.status(500).json({ error: "Server error" });
  }
}

module.exports = {
  createVideo,
  getAllVideos,
};
