import axios from "axios";
import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";
import { toastErrorMessage, toastSuccessMessage } from "../../commonFunction/toastFunctions"
import "../../style/css/profile.css"
import { Avatar, Button, Input, Modal } from "antd"
import noImg from "../../style/images/noImg.png"
import { CloseCircleOutlined, ExclamationCircleOutlined, HeartFilled, HeartOutlined, SendOutlined } from "@ant-design/icons"

const Profile = () => {
    const navigate = useNavigate()
    let count = 0
    const [expertUser, setExpertUser] = useState("")
    const [isLiked, setIsLiked] = useState(false)
    const [likeCount, setlikeCount] = useState(0)
    const [comment, setComment] = useState("")
    const [commentList, setCommentList] = useState([])
    const [currentUserId, setCurrentUserId] = useState("")
    const [commentCount, setCommentCount] = useState(0)
    const { confirm } = Modal;


    useEffect(async () => {
        let token = localStorage.getItem('token')
        const headers = {
            'token': token,
        }
        await axios.get(`/user/oneExpertUserData`, { headers: headers }).then(async (res) => {
            if (res.data.success) {
                setExpertUser(res.data.data)
                await axios.get(`social/fetchLike/${res.data.data._id}`, { headers: headers }).then(async (res) => {
                    if (res.data.success) {
                        const likes = res.data.data.likes
                        await axios.get("/user/fetchOneUserData", { headers: headers }).then(async (result) => {
                            setCurrentUserId(result.data.data._id)
                            await likes.map((key, i) => {
                                if (key.likerId === result.data.data._id) {
                                    setIsLiked(key.liked)
                                }
                                if (key.liked === true) {
                                    count = count + 1
                                }
                            })
                            setlikeCount(count)
                        })
                    }
                })
                await axios.get("/user/fetchOneUserData", { headers }).then(async (result) => {
                    if (result) {
                        setCurrentUserId(result.data.data._id)
                    }
                })
                await axios.get(`social/fetchComment/${res.data.data._id}`, { headers: headers }).then(async (res) => {
                    if (res.data.success) {
                        setCommentList(res.data.data)
                        setCommentCount(res.data.data.length)
                    }
                })
            } else {
                toastErrorMessage(res.data.message);
            }
        })
    }, [])


    const showConfirm = async (id, username) => {
        let token = localStorage.getItem('token')
        const headers = {
            'token': token,
        }
        confirm({
            title: 'are you sure ?',
            icon: <ExclamationCircleOutlined />,
            content: `you want to unfollow ?`,

            onOk() {
                axios.post("user/unfollow", { id: id }, { headers: headers }).then((res) => {
                    if (res.data.success) {
                        toastSuccessMessage(res.data.message);
                        navigate("/dashboard")
                    } else {
                        toastErrorMessage(res.data.message);
                    }
                })
            },

            onCancel() {
                console.log('Cancel');
            },
        });
    };

    const manageLike = async (like) => {
        let token = localStorage.getItem('token')
        const headers = {
            'token': token,
        }
        await axios.post("social/like", { expertId: expertUser._id, like: like }, { headers: headers }).then(() => {
            setIsLiked(like);
            if (like) {
                setlikeCount(likeCount + 1)
            } else {
                setlikeCount(likeCount - 1)
            }
        })
    }

    const sendComment = async () => {
        let token = localStorage.getItem('token')
        const headers = {
            'token': token,
        }
        if (comment !== "") {
            await axios.post("social/addComment", { expertId: expertUser._id, comment: comment }, { headers: headers }).then(async (res) => {
                if (res.data.success) {
                    setComment("")
                    await axios.get(`social/fetchComment/${expertUser._id}`, { headers: headers }).then(async (res) => {
                        if (res.data.success) {
                            setCommentList(res.data.data)
                            setCommentCount(res.data.data.length)
                        }
                    })
                }
            })
        }
    }

    const deleteComment = async (commentId) => {
        let token = localStorage.getItem('token')
        const headers = {
            'token': token,
        }

        axios.delete(`/social/deleteComment/${commentId}`, { headers: headers }).then(async (res) => {
            if (res.data.success) {
                await axios.get(`social/fetchComment/${expertUser._id}`, { headers: headers }).then(async (res) => {
                    if (res.data.success) {
                        setCommentList(res.data.data)
                        setCommentCount(res.data.data.length)

                    }
                })
            }
        })

    }

    return (
        <div>

            <div className="secondForm-container" style={{ margin: "70px 40px 10px 40px", display: "flex", justifyContent: "space-between" }}>
                <div style={{ display: "flex" }}>
                    <Avatar src={expertUser.image === undefined ? noImg : `http://localhost:3000/${expertUser.image}`} alt="image" />
                    <div style={{ marginLeft: "50px", marginTop: "20px" }}>
                        <h2 className="textBlack">{expertUser.username}</h2>
                        <h1 className="textBlack">{expertUser.bio ? expertUser.bio : "this is the bio"}</h1>
                    </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "baseline" }}>
                    <Button type="primary" style={{ width: "150px", height: "45px", borderRadius: "10px", float: "right", margin: "25px 100px 15px 0px" }} onClick={() => showConfirm()}>Following</Button>
                    {
                        isLiked ?
                            <div>

                                <HeartFilled style={{ fontSize: "25px", color: "skyblue" }} onClick={() => { manageLike(false) }} />
                                <span style={{ paddingLeft: "5px" }}>{likeCount}Liked</span>
                            </div>
                            :
                            <div>
                                <HeartOutlined style={{ fontSize: "25px", color: "skyblue" }} onClick={() => { manageLike(true) }} />
                                <span style={{ paddingLeft: "5px" }}>{likeCount}Like</span>
                            </div>
                    }
                    <div>
                        <label htmlFor="inputField" className="textBlack">comments {commentCount}</label>
                        <div style={{ display: "flex", alignItems: "center", position: "relative" }}>
                            <Input placeholder="comments" type="text" id="inputField" name="comment" value={comment} onChange={(e) => { setComment(e.target.value) }} />
                            <SendOutlined style={{ fontSize: "30px", color: "#99999970", position: "absolute", right: "0px" }} onClick={() => sendComment()} />
                        </div>
                        <div style={{ maxHeight: "100px", overflow: "scroll", overflowX: "hidden" }}>
                            {commentList.map((key, i) => {
                                return (
                                    <div key={i} style={{ display: "flex", justifyContent: "space-around", alignItems: "center" }}>
                                        <li >{key.comment}</li>
                                        {
                                            currentUserId === key.commentorId ?
                                                <CloseCircleOutlined style={{ color: "#dad6d6" }} onClick={() => deleteComment(key._id, key.commntorId)} /> :
                                                ""
                                        }
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </div>

            <div>
            </div>
        </div>
    )
}

export default Profile