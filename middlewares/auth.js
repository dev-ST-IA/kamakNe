const UserModel = require('../models/UserModel')
const jwt = require('jsonwebtoken')
const apiResponse = require('../helpers/apiResponse')

const tokenVerify = async (req, res, next) => {
    try {
        const tokenHeader = req.headers.authorization
        const token = tokenHeader.split(" ")[1]
        if (token) {
            const secret = process.env.JWT_KEY
            const verified = jwt.verify(token, secret)
            const data = await UserModel.findById(verified, '-password')
            req.user = data
            next()
        } else {
            return apiResponse.unauthorizedResponse(res, "Authentication Failed")
        }
    } catch (error) {
        console.log(error)
        return apiResponse.ErrorResponse(res, "Bad Request")
    }
}

module.exports = tokenVerify