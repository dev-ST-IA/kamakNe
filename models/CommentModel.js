const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Types.ObjectId, required: true, ref: "user" },
    post: { type: mongoose.Types.ObjectId, required: true, ref: "post" },
    comment: { type: String, default: null, required: true },
    likes: { type: Number, default: 0, required: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("comment", commentSchema);
