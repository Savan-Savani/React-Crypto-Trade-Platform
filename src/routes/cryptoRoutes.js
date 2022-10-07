const express = require('express')
const router = express.Router()

const crypto = require("../controller/cryptoController")

router.get("/allCryptoCoins", crypto.getCryptoCoinsController)

module.exports = router;
