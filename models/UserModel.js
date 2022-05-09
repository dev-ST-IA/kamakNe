const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    userName: { type: String, default: null, required: true, unique: true },
    firstName: { type: String, default: null, required: false },
    lastName: { type: String, default: null, required: false },
    email: { type: String, unique: true, required: false, default: null },
    password: { type: String },
    friends: [{ type: mongoose.Types.ObjectId, required: true, ref: "user" }],
    posts: [{ type: mongoose.Types.ObjectId, required: true, ref: "post" }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("user", userSchema);
