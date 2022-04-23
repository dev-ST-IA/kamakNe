const DriverModel = require('../models/DriverModel')
const PassengerModel = require('../models/PassengerModel')
const EmployeeModel = require('../models/EmployeeModel')
const RideModel = require('../models/RideModel')

exports.driverRoomJoin = async (socket, id) => {
    try {
        if (id) {
            const driver = await DriverModel.findById(id)
            if (driver) {
                socket.join('drivers')
                console.log('joined room', socket.id)
            } else {
                socket.disconnect(true)
            }
        }
    } catch (error) {
        console.log(error)
        socket.disconnect(true)
    }
}


exports.requestDriver = async (socket, payload) => {
    try {
        const { passengerId, driverId, to, from } = payload
        const driver = await DriverModel.findById(driverId)
        if (driver._id) {
            socket.to(`driver: ${driverId}`).emit("request", payload)
        } else {
            socket.disconnect(true)
        }
    } catch (error) {
        socket.disconnect(true)
    }
}

exports.requestDriverConfirmation = async (socket, payload) => {
    try {
        const { passengerId, driverId, toAddress, fromAddress, estimatedCost, contactNumber, name, passengerSocketId, driverSocketId } = payload
        const driver = await DriverModel.findById(driverId)
        if (driver._id) {
            socket.to(driverSocketId).emit("confirming driver", payload)
        } else {
            socket.disconnect(true)
        }
    } catch (error) {
        socket.disconnect(true)
    }
}

exports.rideConfirmation = async (io, payload) => {
    try {
        const { passengerId, driverId, to, from, confirmation, passengerSocketId, driverSocketId, userType, employeeId, employeeSocketId } = payload
        if (userType === "passenger") {
            const passenger = await PassengerModel.findById(passengerId)
            if (passenger._id) {
                io.to(passengerSocketId).emit("confirmation response", payload)
            }
        } else if (userType === "employee") {
            const employee = await EmployeeModel.findById(employeeId)
            if (employee._id) {
                io.to(employeeSocketId).emit("confirmation response", payload)
            }
        }

    } catch (error) {
        console.log(error)
    }
}

exports.joinRide = async (socket, rideId) => {
    try {
        if (rideId) {
            const ride = await RideModel.findById(rideId)
            if (ride) {
                socket.join(rideId)
            } else {
                socket.disconnect(true)
            }
        }
    } catch (error) {
        console.log(error)
        socket.disconnect(true)
    }
}

exports.rideStatusChange = async (io, payload) => {
    try {
        const { rideId, status } = payload
        const ride = await RideModel.findById(rideId)
        if (ride._id) {
            io.to(rideId).emit("ride status", status)
        }
    } catch (error) {
        console.log(error)
    }
}

exports.sendBookedPayload = async (io, payload) => {
    try {
        const { driverSocketId, ...data } = payload
        if (driverSocketId) {
            io.to(driverSocketId).emit("booked ride payload", data)
        }
    } catch (error) {
        console.log(error)
    }
}