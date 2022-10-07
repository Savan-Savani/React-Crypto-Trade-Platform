const express = require('express')
const router = express.Router()
const multer = require("multer")

const authentication = require("../controller/authenticationController")


var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./public/uploads")
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + file.originalname)
    }
})
var upload = multer({ storage: storage })


router.post('/register', authentication.registerController)
router.post('/googleRegister', authentication.googleRegisterController)
router.post('/googleLogin', authentication.googleLoginController)

router.post('/addDetails', authentication.detailsController)

router.post('/verifyOtp', authentication.verifyOtpController)
router.post('/login', authentication.loginController)
router.post('/forget', authentication.forgotPasswordController)
router.post('/reset', authentication.resetPasswordController)
router.post('/phoneCode', authentication.sendPhoneVerificationCodeController)

router.post('/APIkeys', authentication.APIkeysController)

router.post('/progressStep', authentication.progressStepController)

router.get('/getCompletedStep', authentication.getCompletedStepController)


router.post('/upload', upload.single("img"), authentication.imgUploder)


module.exports = router;