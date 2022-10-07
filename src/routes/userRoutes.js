const express = require('express')
const router = express.Router()

const user = require("../controller/userController")


router.get("/fetchOneUserData", user.fetchOneUserDataController)
router.get("/getAllExpertUser", user.getAllExpertUser)

router.post("/follow", user.followController)
router.post("/unfollow", user.unfollowController)


router.get("/oneExpertUserData", user.getOneExpertUserData)

router.get("/fetchFollowers", user.fetchFollowersController)


module.exports = router;
