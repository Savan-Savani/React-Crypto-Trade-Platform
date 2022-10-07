const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    expertId: {
        type: String
    },
    likes: [
        {
            likerId: {
                type: String,
            },
            liked: {
                type: Boolean,
                default: false
            }
        }
    ]
}, { timestamps: true });

const Like = mongoose.model("Like", UserSchema);

module.exports = Like;