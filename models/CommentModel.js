const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const commentSchema = new mongoose.Schema(
  {
    // userId: { type: mongoose.Types.ObjectId, required: true, ref: "user" },
    post: { type: mongoose.Types.ObjectId, required: true, ref: "post" },
    comment: { type: String, default: null, required: true },
    likes: { type: Number, default: 0, required: false },
    severity: {
      type: Map,
      of: String,
    },
  },
  { timestamps: true }
);

commentSchema.plugin(mongoosePaginate);
module.exports = mongoose.model("comment", commentSchema);
