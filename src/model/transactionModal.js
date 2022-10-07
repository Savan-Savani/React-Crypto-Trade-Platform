const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    userId: {
        type: String
    },
    coin: {
        type: String
    },
    coinCount: {
        type: Number
    },
    action: {
        type: String
    }

}, { timestamps: true });

const Transaction = mongoose.model("Transaction", UserSchema);

module.exports = Transaction;