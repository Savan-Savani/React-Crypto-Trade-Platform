const { ValidToken } = require("../config/commonFunction")
const Wallet = require("../model/walletModel")

exports.fetchCurrentUserWalletController = async (req, res) => {
    try {
        let { token } = req.headers
        const tokenData = ValidToken(token)
        if (tokenData) {
            Wallet.findOne({ userId: tokenData.data.id }).then((result) => {
                if (result) {
                    res.send({ success: true, data: result })
                } else {
                    res.send({ success: false, message: "wallet data not found" })
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