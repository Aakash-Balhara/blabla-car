const { timeStamp } = require("console");
const mongoose = require("mongoose");
const { type } = require("os");

const authSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, "First name is required"]
    },
    lastName: {
        type: String,
        required: [true, "last name is required"]
    },
    dob: {
        type: Date,
        required: [true, "dob is required"]
    },
    email: {
        type: String,
        required: [true, "email is required"],
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    isVerified: {
        type: Boolean,
        default: false
    }


}, { timeStamp: true })

const AuthDb = mongoose.model('AuthDb', authSchema);

module.exports = AuthDb;


