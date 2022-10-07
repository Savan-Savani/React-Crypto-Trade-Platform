const express = require('express')
const router = express.Router()

const compliment = require("../controller/complimentController")


router.post("/like", compliment.likeController)
router.get("/fetchLike/:expertId", compliment.fetchLikeController)

router.post("/addComment", compliment.addCommentController)

router.get("/fetchComment/:expertId", compliment.fetchCommentController)
router.delete("/deleteComment/:commentId", compliment.deleteCommentController)


module.exports = router;
