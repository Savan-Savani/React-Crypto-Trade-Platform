const express = require('express')
const router = express.Router()

const transaction = require("../controller/transactionController")

router.post("/buyCoin/:buyerId", transaction.buyCoinController)
router.post("/sellCoin/:sellerId", transaction.sellCoinController)

router.get("/history", transaction.historyController)

module.exports = router;
