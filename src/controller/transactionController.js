const { ValidToken } = require("../config/commonFunction")
const Transaction = require("../model/transactionModal")
const Wallet = require("../model/walletModel")
const { infoEmailSend } = require("../config/commonFunction")
const User = require("../model/userModel")

exports.buyCoinController = async (req, res) => {
    try {
        let { coin, coinCount, currentCoinPrice } = req.body
        let { token } = req.headers
        let { buyerId } = req.params
        const tokenData = ValidToken(token)
        let username
        let email
        if (tokenData) {
            await User.findOne({ _id: buyerId }, { email: 1, username: 1 }).then(async (userData) => {
                username = userData.username
                email = userData.email
            })

            await Wallet.findOne({ userId: buyerId }).then(async (result) => {
                if (result) {
                    if (result.coins[0].coinCount < coinCount * currentCoinPrice) {
                        const isEmailSend = infoEmailSend(email, username, coin, coinCount, "BUY", "error")
                        if (isEmailSend) {
                            res.send({ success: false, message: "please add enough USDT" })
                        }

                    } else {
                        let usdtCount = coinCount * currentCoinPrice
                        if (result.coins.some(key => key.coin === coin)) {
                            result.coins.map((key, i) => {
                                if (key.coin === coin) {
                                    key.coinCount = key.coinCount + parseFloat(coinCount)
                                    result.coins[0].coinCount = (result.coins[0].coinCount - usdtCount).toFixed(2)
                                }
                            })
                        } else {
                            result.coins[0].coinCount = (result.coins[0].coinCount - usdtCount).toFixed(2)
                            result.coins.push({ coin, coinCount })
                        }
                        await Wallet.findOneAndUpdate({ userId: result.userId }, { coins: result.coins }).then(async (r) => {
                            await Transaction.create({ userId: result.userId, coin: coin, coinCount: coinCount, action: "BUY" })
                            const isEmailSend = infoEmailSend(email, username, coin, coinCount, "BUY")
                            if (isEmailSend) {
                                res.send({ success: true, message: "coin buy successfull", data: r })
                            }
                        }).catch((err) => {
                            res.send({ success: false, message: err.message })
                        })
                    }
                } else {
                    await Wallet.create({ userId: buyerId, "coins": { coin: "USDT", coinCount: 10000 } })

                    res.send({ success: false, message: "wallet is Empty" })
                }
            })
        } else {
            res.send({ success: false, message: "user not found" })
        }
    } catch (error) {
        res.send({ success: false, message: error.message })
    }
}

exports.sellCoinController = async (req, res) => {
    try {
        let { coin, sellCount, currentCoinPrice } = req.body
        let { token } = req.headers
        let { sellerId } = req.params
        let username
        let email
        let error = false
        const tokenData = ValidToken(token)
        if (tokenData) {
            await User.findOne({ _id: sellerId }, { email: 1, username: 1 }).then(async (userData) => {
                username = userData.username
                email = userData.email
            })
            await Wallet.findOne({ userId: sellerId }).then(async (result) => {
                if (result) {
                    result.coins.map(async (key, i) => {
                        if (key.coin === coin) {
                            if (key.coinCount < sellCount) {
                                error = true
                            } else {
                                key.coinCount -= parseFloat(sellCount)
                                result.coins[0].coinCount = result.coins[0].coinCount + sellCount * currentCoinPrice
                            }
                        }
                    })
                    if (error) {
                        const isEmailSend = await infoEmailSend(email, username, coin, sellCount, "SELL", "error")
                        if (isEmailSend) {
                            res.send({ success: false, message: `not enough ${coin} in wallet` })
                        }
                    } else {

                        await Wallet.findOneAndUpdate({ userId: result.userId }, { coins: result.coins }).then(async (r) => {
                            await Transaction.create({ userId: result.userId, coin: coin, coinCount: sellCount, action: "SELL" })
                            const isEmailSend = infoEmailSend(email, username, coin, sellCount, "SELL")
                            if (isEmailSend) {
                                res.send({ success: true, message: "coin sell successfull", data: r })
                            }
                        }).catch((err) => {
                            res.send({ success: false, message: err.message })
                        })
                    }
                } else {
                    res.send({ success: false, message: "wallet is empty" })
                }
            }).catch((err) => {
                res.send({ success: false, message: err.message })
            })
        } else {
            res.send({ success: false, message: "user not found" })
        }
    } catch (error) {
        res.send({ success: false, message: error.message })
    }
}

exports.historyController = async (req, res) => {
    try {
        let { token } = req.headers
        const tokenData = ValidToken(token)
        if (tokenData) {
            Transaction.find({ userId: tokenData.data.id }, { userId: 0, _id: 0, _v: 0 }).then((result) => {
                if (result.length !== 0) {
                    res.send({ success: true, data: result.reverse() })
                } else {
                    res.send({ success: false, message: "no history found" })
                }
            }).catch((err) => {
                res.send({ success: false, message: err.message })
            })
        }
        else {
            res.send({ success: false, message: "user not found" })

        }

    } catch (error) {
        res.send({ success: false, message: error.message })
    }
}