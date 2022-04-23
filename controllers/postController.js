const UserModel = require("../models/UserModel");
const PostModel = require("../models/PostModel");
const { oneOf, body, validationResult } = require("express-validator");
const { sanitizeBody } = require("express-validator");
//helper file to prepare responses.
const apiResponse = require("../helpers/apiResponse");
var mongoose = require("mongoose");
const assert = require("assert");
const cloudinary = require("../config/cloudinary");
const fs = require("fs");

exports.createPost = (req, res) => {
  try {
    const { caption, mediaType } = req.body;
    const media = req.files[0];
    const newName = `img-3`;
    const path = media.path;
    fs.unlink(path, (err) => {
      if (err) console.log(err);
      console.log("success");
    });
    console.log(req.files);
    console.log(caption, mediaType);
    return apiResponse.successResponse(res, "success");
    // cloudinary.uploader.upload(media,(err,result)=>{

    // })
  } catch (error) {
    return apiResponse.ErrorResponse(res, error);
  }
};
