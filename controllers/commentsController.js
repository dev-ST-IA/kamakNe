const UserModel = require("../models/UserModel");
const PostModel = require("../models/PostModel");
const CommentModel = require("../models/CommentModel");
const { oneOf, body, validationResult } = require("express-validator");
const { sanitizeBody } = require("express-validator");
//helper file to prepare responses.
const apiResponse = require("../helpers/apiResponse");
var mongoose = require("mongoose");
const assert = require("assert");
const https = require("https");
const identificationService = require("../config/hateSpeechIdentifierService");
const identificationURL = identificationService.BASE_URL;
const request = require("request");
const { resolve } = require("path");

exports.getComments = async (req, res) => {
  try {
    const page = Number(req.query.Page) || 1;
    const size = 10;
    const id = req.query.Id;

    CommentModel.paginate(
      { post: id },
      { offset: (page - 1) * size, limit: size, page: page, sort: {} },
      (err, results) => {
        if (err) return apiResponse.ErrorResponse(res, err);
        return apiResponse.successResponseWithData(
          res,
          "Comments Found",
          results
        );
      }
    );
  } catch (error) {
    return apiResponse.ErrorResponse(res, error);
  }
};

exports.createComment = async (req, res) => {
  try {
    const { comment, postId } = req.body;

    const post = await PostModel.findById(postId);
    if (!post) {
      return apiResponse.notFoundResponse(res, "Post Not Found");
    }
    const postData = JSON.stringify({
      comment: comment,
    });
    const prediction = new Promise((resolve, reject) => {
      request(
        {
          url: identificationURL + "/predict/",
          method: "POST",
          body: postData,
        },
        (err, res, body) => {
          if (res.statusCode != 200) {
            reject(err);
          }
          const parsed = JSON.parse(body);
          resolve(parsed.result);
        }
      );
    });
    prediction.then(async (data) => {
      const predictObj = data;
      // predictObj.forEach((element) => {
      //   console.log(element);
      // });
      const newComment = await CommentModel.create({
        post: post._id,
        comment: comment,
        severity: predictObj,
      });
      return apiResponse.successResponseWithData(res, "Commented", newComment);
    });
  } catch (error) {
    return apiResponse.ErrorResponse(res, error);
  }
};

exports.getComment = async (req, res) => {
  try {
    const id = req.query.Id;
    const doc = await CommentModel.findById(id);
    if (!doc) {
      return apiResponse.notFoundResponse(res, "Comment Not Found");
    }
    return apiResponse.successResponseWithData(res, "Comment Found", doc);
  } catch (error) {
    return apiResponse.ErrorResponse(res, error);
  }
};
