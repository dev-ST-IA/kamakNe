const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const postSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Types.ObjectId, required: true, ref: "user" },
    comments: [
      { type: mongoose.Types.ObjectId, required: false, ref: "comment" },
    ],
    mediaUrl: { type: String, default: null, required: false },
    mediaType: { type: String, default: null, required: false },
    caption: { type: String, default: null, required: false },
    likesBy: [{ type: mongoose.Types.ObjectId, required: true, ref: "user" }],
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);
postSchema.plugin(mongoosePaginate);
postSchema.virtual("likes").get(function () {
  const count = this.likesBy.length;
  return count;
});
module.exports = mongoose.model("post", postSchema);
