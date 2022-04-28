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
const { api } = require("../config/cloudinary");

const uploadImage = async (path, filename) => {
  try {
    const url = await cloudinary.uploader.upload(path, {
      overwrite: true,
      public_id: `kamakne/images/${filename}`,
    });
    return url.url;
  } catch (error) {
    throw error;
  }
};

const uploadVideo = async (path, filename) => {
  try {
    const url = await cloudinary.uploader.upload(path, {
      resource_type: "video",
      public_id: `kamakne/videos/${filename}`,
      chunk_size: 6000000,
      overwrite: true,
    });
    return url.url;
  } catch (error) {
    throw error;
  }
};

exports.createPost = async (req, res) => {
  try {
    const { caption, mediaType } = req.body;

    const newPost = await PostModel.create({
      mediaType,
      caption,
    });
    const media = req.files[0];
    media.filename = newPost["_id"];
    const filename = media.filename;
    const path = media.path;
    let url = "";
    if (mediaType === "image") {
      url = await uploadImage(path, filename);
    } else if (mediaType === "video") {
      url = await uploadVideo(path, filename);
    }
    if (mediaType != "") {
      fs.unlink(path, (err) => {
        if (err) throw err;
      });
    }
    newPost.mediaUrl = url;
    await newPost.save().then((saved) => {
      return apiResponse.successResponseWithData(res, "Post Added", saved);
    });
  } catch (error) {
    return apiResponse.ErrorResponse(res, error);
  }
};

exports.getPosts = async (req, res) => {
  try {
    const page = Number(req.query.Page) || 1;
    const size = 10;

    PostModel.paginate(
      {},
      { offset: (page - 1) * size, limit: size, page: page },
      (err, results) => {
        if (err) return apiResponse.ErrorResponse(res, err);
        return apiResponse.successResponseWithData(res, "Posts Found", results);
      }
    );
  } catch (error) {
    return apiResponse.ErrorResponse(res, error);
  }
};

exports.getPost = async (req, res) => {
  try {
    const id = req.query.id;
    const post = await PostModel.findById(id).then((doc) => {
      if (!doc) {
        return apiResponse.notFoundResponse(res, "Post Not Found");
      }
      return apiResponse.successResponseWithData(res, "Post Found", doc);
    });
  } catch (error) {
    return apiResponse.ErrorResponse(res, error);
  }
};
