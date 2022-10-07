const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String
    },
    phoneNumber: {
        type: String
    },
    username: {
        type: String
    },
    source: {
        type: String
    },
    referCode: {
        type: String
    },
    type: {
        type: String,
    },
    otp: {
        type: Number
    },
    isEmailVerified: {
        type: Boolean, default: false
    },
    isPhoneVerified: {
        type: Boolean, default: false
    },
    phoneOtp: {
        type: Number
    },
    accountName: {
        type: String
    },
    key: {
        type: String
    },
    secret: {
        type: String
    },
    registerProgressStep: {
        type: Number,
        default: 0
    },
    userType: {
        type: String
    },
    image: {
        type: String
    },
    bio: {
        type: String
    },
    followedExpertId: {
        type: String
    },
    followedPercentage: {
        type: Number
    }


}, { timestamps: true });

const User = mongoose.model("User", UserSchema);

module.exports = User;