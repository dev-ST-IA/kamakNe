const jwt = require('jsonwebtoken')
const response = require('../helpers/apiResponse')
const UserModel = require('../models/UserModel')
const config = process.env
const apiResponse = require("../helpers/apiResponse")

const verifyTokenOnReq = (req, res, next) => {
    const header = req.headers.authorization
    const token = header.split(" ")[1]

    if (!token) {
        return response.unauthorizedResponse(res, "Authorization Failed")
    }
    try {
        const decoded = jwt.verify(token, config.JWT_SECRET)
        const id = decoded.id
        UserModel.findById(id).then(data => {
            if (!data) {
                return apiResponse.notFoundResponse(res, "User Not Found")
            }
            req.user = data
            return next()
        })
    } catch (error) {
        return response.unauthorizedResponse(res, "Authorization Failed")
    }
}

module.exports = verifyTokenOnReq