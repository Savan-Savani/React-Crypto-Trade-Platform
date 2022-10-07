const CoinGecko = require('coingecko-api');
const CoinGeckoClient = new CoinGecko();

exports.getCryptoCoinsController = async (req, res) => {
    try {
        await CoinGeckoClient.coins.markets({ vs_currency: "usd", order: "market_cap_desc", per_page: 100, page: 1 }).then(async (result) => {
            res.send({ success: true, data: result.data })
        }).catch((err) => {
            res.send({ success: false, message: err.message })
        })
    } catch (error) {
        res.send({ success: false, message: error.message })
    }
}