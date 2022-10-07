import React, { useEffect, useState } from "react"
import axios from "axios"
import { Avatar, Button } from "antd"
import { Steps } from 'antd';
import noImg from "../../../style/images/noImg.png"
import { useNavigate } from "react-router-dom";
import { toastErrorMessage } from "../../../commonFunction/toastFunctions"


const { Step } = Steps;

const ExpertDashboard = () => {
    let token = localStorage.getItem('token')
    const headers = {
        'token': token,
    }
    const navigate = useNavigate()

    const [currentUser, setCurrentUser] = useState("")
    const [isSetupComplete, setIsSetupComplete] = useState(true)
    const [followerCount, setfollowerCount] = useState(0)
    const [likeCount, setLikeCount] = useState(0)


    useEffect(async () => {
        await axios.get("/user/fetchOneUserData", { headers }).then(async (res) => {
            if (res.data.success) {
                setCurrentUser(res.data.data)
                if (res.data.data.registerProgressStep <= 2) {
                    setIsSetupComplete(false)
                }
                await axios.get(`/social/fetchLike/${res.data.data._id}`, { headers }).then(async (e) => {
                    if (e.data.success) {
                        e.data.data.likes.map((key, i) => {
                            if (key.liked) {
                                setLikeCount(likeCount + 1)
                            }
                        })
                    } else {
                        toastErrorMessage(e.data.message)
                    }
                })
            } else {
                toastErrorMessage(res.data.message);
            }
        })

        await axios.get("/user/fetchFollowers", { headers }).then((res) => {
            if (res.data.success) {
                setfollowerCount(res.data.data.length)
            } else {
                toastErrorMessage(res.data.message);
            }
        })

    }, [])




    return (
        <div>
            <div>
                {
                    isSetupComplete ?
                        <div></div> :
                        <div className="secondForm-container" style={{ display: "flex", justifyContent: "space-around", alignItems: "center", paddingTop: "0px" }}>
                            <div>
                                <h3 className="textBlack">Hello ,{currentUser.username.toUpperCase()}</h3>
                                <h1 className="textBlack" >You are just 2 steps away from setting up your account <br /> to start your investment journey.</h1>
                                <Button type="primary" onClick={() => { navigate("/kyc") }}>Complete setup</Button >
                            </div>
                            <div>
                                <Steps size="small" current={2} labelPlacement="vertical">
                                    <Step title="Username" status="finish" />
                                    <Step title="verification" status="finish" />
                                    <Step title="Enter API & Secret Key" status="process" />
                                </Steps>
                            </div>
                        </div>
                }
            </div>
            <div className="secondForm-container" style={{ margin: "70px 40px 10px 40px", display: "flex", justifyContent: "space-between" }}>
                <div style={{ display: "flex" }}>
                    <Avatar src={currentUser.image === undefined ? noImg : `http://localhost:3000/${currentUser.image}`} alt="image" />
                    <div style={{ marginLeft: "50px", marginTop: "20px" }}>
                        <h2 className="textBlack">{currentUser.username}</h2>
                        <h1 className="textBlack">{currentUser.bio ? currentUser.bio : "this is the bio"}</h1>
                    </div>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", paddingRight: "50px" }}>
                    <div>
                        <label className="textBlack" style={{ padding: "30px 30px 0px 30px", fontSize: "18px" }}>Followers</label>
                        <h4 className="textBlack">{followerCount}</h4>
                    </div>
                    <div>
                        <label className="textBlack" style={{ padding: "30px 30px 0px 30px", fontSize: "18px" }}>Likes</label>
                        <h4 className="textBlack">{likeCount}</h4>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ExpertDashboard