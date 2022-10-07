const { ValidToken } = require("../config/commonFunction")
const Comment = require("../model/commentModel")
const Like = require("../model/likeModel")

exports.likeController = (req, res) => {
    try {
        let { like, expertId } = req.body
        let { token } = req.headers
        const tokenData = ValidToken(token)
        if (tokenData) {
            Like.findOne({ expertId: expertId }).then(async (result) => {
                if (result) {
                    await Like.findOne({ expertId: expertId, "likes.likerId": tokenData.data.id }).then(async (e) => {
                        if (e) {
                            await Promise.all(e.likes.map((key) => {
                                if (key.likerId === tokenData.data.id) {
                                    key.liked = like
                                }
                            }))
                            await Like.findOneAndUpdate({ expertId: expertId, "likes.likerId": tokenData.data.id }, { likes: e.likes }).then(() => {
                                res.send({ success: true, message: "like updated" })
                            })
                        } else {
                            await Like.findOneAndUpdate({ expertId: expertId }, { "$push": { "likes": { likerId: tokenData.data.id, liked: like } } }, { new: true }).then((e) => {
                                res.send({ success: true, message: "new compliment pushed" })
                            })
                        }
                    })
                } else {
                    await Like.create({ expertId: expertId, "likes": { likerId: tokenData.data.id, liked: like } }).then(() => {
                        res.send({ success: true, message: "like successfull" })
                    })
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

exports.fetchLikeController = (req, res) => {
    try {
        let { expertId } = req.params
        let { token } = req.headers
        const tokenData = ValidToken(token)
        if (tokenData) {
            Like.findOne({ expertId: expertId }).then((result) => {
                if (result) {

                    res.send({ success: true, data: result })
                } else {
                    res.send({ success: false, message: "no compliment available" })
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

exports.addCommentController = (req, res) => {
    try {
        let { comment, expertId } = req.body
        let { token } = req.headers
        const tokenData = ValidToken(token)
        if (tokenData) {
            Comment.create({ expertId: expertId, commentorId: tokenData.data.id, comment: comment }).then((result) => {
                res.send({ success: true, message: "comment added successfully" })
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

exports.fetchCommentController = (req, res) => {
    try {
        let { expertId } = req.params
        let { token } = req.headers
        const tokenData = ValidToken(token)
        if (tokenData) {
            Comment.find({ expertId }).then((result) => {
                if (result.length !== 0) {
                    res.send({ success: true, data: result.reverse() })

                } else {
                    res.send({ success: false, message: "no comment found" })
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

exports.deleteCommentController = (req, res) => {
    try {
        let { commentId } = req.params
        let { token } = req.headers
        const tokenData = ValidToken(token)
        if (tokenData) {
            Comment.findOneAndDelete({ _id: commentId }).then((result) => {
                if (result) {

                    res.send({ success: true, message: "delete successfull" })
                } else {
                    res.send({ success: false, message: "no item deleted" })
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