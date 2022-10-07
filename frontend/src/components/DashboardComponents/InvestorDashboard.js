import axios from "axios"
import React, { useEffect, useState } from "react"
import { Button, Avatar, Card, Modal, Form, InputNumber } from "antd"
import { Steps } from 'antd';
import { useNavigate } from "react-router-dom";
import noImg from "../../style/images/noImg.png"
import { ExclamationCircleOutlined } from '@ant-design/icons';
import "../../style/css/investorDashboard.css"
import { toastErrorMessage, toastSuccessMessage } from "../../commonFunction/toastFunctions"

const { confirm } = Modal;
const { Step } = Steps;

const InvestorDashboard = () => {
    const navigate = useNavigate()
    const [isSetupComplete, setIsSetupComplete] = useState(true)
    const { Meta } = Card;
    const [expertData, setExpertData] = useState([])
    const [expertId, setExpertId] = useState("")
    const [expertUsername, setExpertUsername] = useState("")
    const [tempExpertId, setTempExpertId] = useState("")
    const [isModalVisible, setIsModalVisible] = useState(false);

    useEffect(async () => {
        let token = localStorage.getItem('token')
        const headers = {
            'token': token,
        }
        await axios.get("auth/getCompletedStep", { headers: headers }).then((res) => {
            if (res.data.step <= 2) {
                setIsSetupComplete(false)
            }
        })
        await axios.get("user/getAllExpertUser", { headers: headers }).then((res) => {
            if (res.data.success) {
                setExpertData(res.data.data)
            }
        })
        await axios.get("user/fetchOneUserData", { headers }).then((res) => {
            if (res.data.success) {
                if (res.data.data.followedExpertId !== "") {
                    setExpertId(res.data.data.followedExpertId)
                }
            }
        })
    }, [])


    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleOk = () => {
        setIsModalVisible(false);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };
    const onFinish = (values) => {
        if (values.percentage !== undefined) {

            let token = localStorage.getItem('token')
            const headers = {
                'token': token,
            }
            if (expertId !== "") {
                toastErrorMessage("already following anthor Expert ,please unfollow & try again");
            } else {

                confirm({
                    title: 'are you sure ?',
                    icon: <ExclamationCircleOutlined />,
                    content: `following ${expertUsername} with ${values.percentage}%`,

                    onOk() {
                        axios.post("user/follow", { id: tempExpertId, percentage: values.percentage }, { headers: headers }).then((res) => {
                            if (res.data.success) {
                                toastSuccessMessage(res.data.message);
                                navigate("/profile")
                            } else {
                                toastErrorMessage(res.data.message);
                            }
                        })
                    },

                    onCancel() {
                        console.log('Cancel');
                    },
                });
            }
        } else {
            toastErrorMessage("percentage muse be 1-100%");
        }
    }

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    const ModalForm = () => {
        return (
            <Form
                name="basic"
                labelCol={{
                    span: 8,
                }}
                wrapperCol={{
                    span: 16,
                }}
                initialValues={{
                    remember: true,
                }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
            >
                <h1 className="textBlack" style={{ textAlign: "center" }}>select follow percentage</h1>
                <Form.Item
                    label="percentage (%)"
                    name="percentage"

                    rules={[
                        {
                            message: 'Please select percentage from 1-100%!',
                            type: "integer",
                            min: 1, max: 100,
                        },
                    ]}
                >
                    <InputNumber style={{ width: "60%" }} />
                </Form.Item>
                <Form.Item
                    wrapperCol={{
                        offset: 8,
                        span: 16,
                    }}
                >
                    <Button type="primary" htmlType="submit">
                        Submit
                    </Button>
                </Form.Item>
                <p style={{ textAlign: "center", fontSize: "10px" }}>*Description = if you follow 20% , that means Expert place order of 100 USDT,<br /> user has Order worth 20 USDT Automatically. </p>
            </Form>
        )
    }
    return (
        <div style={{ margin: "100px" }}>
            <div >
                {
                    isSetupComplete ?
                        <div></div> :
                        <div className="secondForm-container" style={{ display: "flex", justifyContent: "space-around", alignItems: "center", paddingTop: "0px" }}>
                            <div>
                                <h3 className="textBlack">Hello ,User</h3>
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
            <div className="secondForm-container" style={{ paddingLeft: "20%" }} >
                {
                    expertData.map((key, i) => {
                        return (

                            <div key={i}>

                                <Card
                                    style={{
                                        width: 500,
                                        marginTop: 16,
                                    }}
                                >
                                    <Meta
                                        avatar={<Avatar src={key.image === undefined ? noImg : `http://localhost:3000/${key.image}`} alt="image" />}
                                        title={key.username}
                                        description={key.bio ? key.bio : "This is bio"}
                                    />
                                    {expertId === key._id ?
                                        <Button type="primary" htmlType="submit" style={{ float: "right" }} onClick={() => navigate("/profile")}>Following</Button>
                                        :
                                        <div>
                                            <Button type="primary" htmlType="submit" onClick={() => { showModal(); setTempExpertId(key._id); setExpertUsername(key.username) }} style={{ float: "right" }}>Follow</Button>
                                            <Modal title="" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel} footer={null}>
                                                <ModalForm />
                                            </Modal>
                                        </div>
                                    }
                                </Card>
                            </div>
                        )
                    })
                }
            </div>
        </div >
    )
}

export default InvestorDashboard