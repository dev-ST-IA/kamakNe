const UserModel = require("../models/UserModel");
const { oneOf, body, validationResult } = require("express-validator");
const { sanitizeBody } = require("express-validator");
//helper file to prepare responses.
const apiResponse = require("../helpers/apiResponse");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
var mongoose = require("mongoose");

/**
 * User registration.
 *
 * @param {string}      firstName
 * @param {string}      lastName
 * @param {string}      email
 * @param {string}      password
 *
 * @returns {Object}
 */
exports.register = [
  // Validate fields.
  body("email")
    .isLength({ min: 1 })
    .trim()
    .withMessage("Email must be specified.")
    .isEmail()
    .withMessage("Email must be a valid email address.")
    .custom((value) => {
      return UserModel.findOne({ email: value }).then((user) => {
        if (user) {
          return Promise.reject("E-mail already in use");
        }
      });
    }),
  body("userName")
    .isLength({ min: 1 })
    .trim()
    .withMessage("invalid username")
    .custom((value) => {
      return UserModel.findOne({ userName: value }).then((user) => {
        if (user) {
          return Promise.reject("Username already in use");
        }
      });
    })
    .optional(),
  body("password")
    .isLength({ min: 6 })
    .trim()
    .withMessage("Password must be 6 characters or greater."),
  // Sanitize fields.
  sanitizeBody("userName").escape(),
  sanitizeBody("email").escape(),
  sanitizeBody("password").escape(),
  // Process request after validation and sanitization.
  (req, res) => {
    try {
      // Extract the validation errors from a request.
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        // Display sanitized values/errors messages.
        return apiResponse.validationErrorWithData(
          res,
          errors.array().map((err) => err.msg)[0],
          errors.array()
        );
      } else {
        //hash input password
        bcrypt.hash(req.body.password, 10, function (err, hash) {
          // generate OTP for confirmation
          // let otp = utility.randomNumber(4);
          // Create User object with escaped and trimmed data
          var user = new UserModel({
            userName: req.body.userName || "",
            email: req.body.email,
            password: hash,
          });
          user.save(function (err) {
            if (err) {
              return apiResponse.ErrorResponse(res, err);
            }
            let userData = {
              user: {
                _id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                userName: user.userName,
              },
            };
            //Prepare JWT token for authentication
            const jwtPayload = {
              id: user._id,
            };
            const jwtData = {
              expiresIn: process.env.JWT_TIMEOUT_DURATION,
            };
            const secret = process.env.JWT_SECRET;
            //Generated JWT token with Payload and secret.
            userData.token = jwt.sign(jwtPayload, secret, jwtData);
            return apiResponse.successResponseWithData(
              res,
              "Registration Success.",
              userData
            );
          });
          // }).catch(err => {
          // 	console.log(err);
          // 	return apiResponse.ErrorResponse(res,err);
          // }) ;
        });
      }
    } catch (err) {
      //throw error in json response with status 500.
      return apiResponse.ErrorResponse(res, err);
    }
  },
];

/**
 * User login.
 *
 * @param {string}      email
 * @param {string}      password
 *
 * @returns {Object}
 */
exports.login = [
  oneOf([
    body("email")
      .isLength({ min: 1 })
      .trim()
      .withMessage("Email/Username must be specified.")
      .isEmail()
      .withMessage("Email must be a valid email address."),
    body("userName")
      .isLength({ min: 1 })
      .trim()
      .withMessage("Email/Username must be specified"),
  ]),
  body("password")
    .isLength({ min: 1 })
    .trim()
    .withMessage("Password must be specified."),
  sanitizeBody("email").escape(),
  sanitizeBody("userName").escape(),
  sanitizeBody("password").escape(),
  (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return apiResponse.validationErrorWithData(
          res,
          errors.array().map((err) => err.msg)[0],
          errors.array()
        );
      } else {
        let query;
        if (req.body.email) {
          query = { email: req.body.email };
        } else {
          query = { userName: req.body.userName };
        }
        UserModel.findOne(query).then((user) => {
          if (user) {
            //Compare given password with db's hash.
            bcrypt.compare(
              req.body.password,
              user.password,
              function (err, same) {
                if (same) {
                  //Check account confirmation.
                  if (user.isConfirmed) {
                    // Check User's account active or not.
                    if (user.status) {
                      let userData = {
                        user: {
                          _id: user._id,
                          firstName: user.firstName,
                          lastName: user.lastName,
                          email: user.email,
                          userName: user.userName,
                        },
                      };
                      //Prepare JWT token for authentication
                      const jwtPayload = {
                        id: user._id,
                      };
                      const jwtData = {
                        expiresIn: process.env.JWT_TIMEOUT_DURATION,
                      };
                      const secret = process.env.JWT_SECRET;
                      //Generated JWT token with Payload and secret.
                      userData.token = jwt.sign(jwtPayload, secret, jwtData);
                      return apiResponse.successResponseWithData(
                        res,
                        "Login Success.",
                        userData
                      );
                    } else {
                      return apiResponse.unauthorizedResponse(
                        res,
                        "Account is not active. Please contact admin."
                      );
                    }
                  } else {
                    return apiResponse.unauthorizedResponse(
                      res,
                      "Account is not confirmed. Please confirm your account."
                    );
                  }
                } else {
                  return apiResponse.unauthorizedResponse(
                    res,
                    "Email/Username or Password wrong."
                  );
                }
              }
            );
          } else {
            return apiResponse.unauthorizedResponse(
              res,
              "Email/Username or Password wrong."
            );
          }
        });
      }
    } catch (err) {
      return apiResponse.ErrorResponse(res, err);
    }
  },
];

function UserData(data) {
  this.id = data._id;
  this.createdAt = data.createdAt;
  this.email = data.email;
  this.opponentList = data.opponentList;
  // this.firstName = data.firstName;
  // this.lastName = data.lastName;
}

exports.getDetails = [
  //  auth,
  function (req, res) {
    try {
      UserModel.findOne({ _id: req.user._id }).then((squad) => {
        if (squad !== null) {
          const data = {
            user: new UserData(squad),
          };
          return apiResponse.successResponseWithData(
            res,
            "Operation success",
            data
          );
        } else {
          return apiResponse.successResponseWithData(res, "No User Found", {});
        }
      });
    } catch (err) {
      //throw error in json response with status 500.
      return apiResponse.ErrorResponse(res, err);
    }
  },
];
