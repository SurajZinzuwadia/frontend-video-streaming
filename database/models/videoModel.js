const mongoose = require("mongoose");

const videoSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  videoUrl: {
    type: String,
    required: true,
  },
  title: String,
  description: String,
  isHighlight: {
    type: Boolean,
    default: true,
  },
});

const Video = mongoose.model("Video", videoSchema);

module.exports = Video;
