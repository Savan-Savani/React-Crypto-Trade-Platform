const express = require('express')
const router = express.Router()

const wallet = require("../controller/walletController")

router.get("/fetchCurrentWallet", wallet.fetchCurrentUserWalletController)

module.exports = router;
