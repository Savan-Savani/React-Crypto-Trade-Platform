const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    userId: {
        type: String
    },
    coins: [{
        coin: String,
        coinCount: Number,
    }]

}, { timestamps: true });

const Wallet = mongoose.model("Wallet", UserSchema);

module.exports = Wallet;