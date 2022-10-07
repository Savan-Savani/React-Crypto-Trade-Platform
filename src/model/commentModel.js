const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    expertId: {
        type: String
    },
    commentorId: {
        type: String,
    },
    comment: {
        type: String
    }
}, { timestamps: true });

const Comment = mongoose.model("Comment", UserSchema);

module.exports = Comment;