const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Types.ObjectId, required: true, ref: "user" },
    comments: [
      { type: mongoose.Types.ObjectId, required: true, ref: "comment" },
    ],
    mediaUrl: { type: String, default: null, required: false },
    mediaType: { type: String, default: null, required: false },
    caption: { type: String, default: null, required: false },
    likes: { type: Number, default: 0, required: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("post", postSchema);
