const User = require("../model/userModel")
const { ValidToken } = require("../config/commonFunction")

exports.fetchOneUserDataController = async (req, res) => {
    try {
        const { token } = req.headers
        const tokenData = ValidToken(token)
        if (tokenData) {
            User.findOne({ email: tokenData.data.email }).then((result) => {
                if (result) {
                    res.send({ success: true, data: result })
                } else {
                    res.send({ success: false, message: "data not found" })
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

exports.getAllExpertUser = async (req, res) => {
    try {
        const { token } = req.headers
        const tokenData = ValidToken(token)
        if (tokenData) {
            User.find({ userType: "Expert" }, { username: 1, bio: 1, image: 1 }).then((result) => {
                if (result.length !== 0) {
                    res.send({ success: true, data: result })
                } else {
                    res.send({ success: false, message: "Expert not found" })
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

exports.followController = (req, res) => {
    try {
        const { token } = req.headers
        const { id, percentage } = req.body
        const tokenData = ValidToken(token)
        if (tokenData) {
            User.findOneAndUpdate({ _id: tokenData.data.id }, { followedExpertId: id, followedPercentage: percentage }).then(() => {
                res.send({ success: true, message: "follow successfull" })
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

exports.getOneExpertUserData = (req, res) => {
    try {
        const { token } = req.headers
        const tokenData = ValidToken(token)
        if (tokenData) {
            User.findById({ _id: Object(tokenData.data.id) }).then((result) => {
                if (result.followedExpertId !== "") {
                    User.findById({ _id: Object(result.followedExpertId) }).then((response) => {
                        res.send({ success: true, data: response })
                    }).catch((err) => {
                        res.send({ success: false, message: err.message })
                    })
                } else {
                    res.send({ success: false, message: "expert not found" })
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

exports.unfollowController = (req, res) => {
    try {
        const { token } = req.headers
        const tokenData = ValidToken(token)
        if (tokenData) {
            User.findOneAndUpdate({ _id: tokenData.data.id }, { followedExpertId: "" }).then((result) => {
                if (result) {

                    res.send({ success: true, message: "unfollow succesfull" })
                } else {
                    res.send({ success: false, message: "expert not found" })
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

exports.fetchFollowersController = async (req, res) => {
    try {
        const { token } = req.headers
        const tokenData = ValidToken(token)
        if (tokenData) {
            User.find({ followedExpertId: tokenData.data.id }, { username: 1, image: 1, _id: 1, followedPercentage: 1 }).then((result) => {
                if (result.length !== 0) {
                    res.send({ success: true, data: result })
                } else {
                    res.send({ success: false, message: "no follower found" })
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
