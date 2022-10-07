import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Checkbox, Upload } from 'antd';
import noImg from "../../style/images/noImg.png"
import "../../style/css/completeProfile.css"
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
const CompleteProfile = () => {
    let navigate = useNavigate()
    const [form] = Form.useForm();
    const { TextArea } = Input;
    const [tempImg, settempImg] = useState("");
    const [img, setImage] = useState([]);


    const onFinish = async (values) => {
        var bodyFormData = new FormData();
        bodyFormData.append("username", values.username)
        bodyFormData.append("img", img);
        bodyFormData.append("bio", values.bio)

        await axios.post('/auth/upload', bodyFormData).then((result) => {
            if (result.data.success) {
                navigate('/dashboard')
            }
        })
    };
    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };
    useEffect(async () => {
        let token = localStorage.getItem('token')
        const headers = {
            'token': token,
        }
        await axios.get("user/fetchOneUserData", { headers: headers }).then((res) => {
            if (res.data.data.image !== undefined || res.data.data.bio !== undefined) {
                navigate("/dashboard")
            } else {
                form.setFieldsValue({
                    username: res.data.data.username,
                    usertype: res.data.data.userType,
                    phonenumber: res.data.data.phoneNumber
                })
            }
        })
    }, [])
    function processImage(event) {
        const imageFile = event.target.files[0];
        const imageUrl = URL.createObjectURL(imageFile);
        settempImg(imageUrl);
        setImage(imageFile);
    }
    return (
        <div>
            <div style={{ margin: "100px" }}>
                <div className='secondForm-container' style={{ paddingTop: "40px " }}>
                    <div style={{ paddingBottom: "40px" }}>
                        <h3 className="textBlack">Complete your profile</h3>
                    </div>
                    <Form
                        form={form}
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
                        <Form.Item name="Image" label="Profile Pic">
                            <label for="file-upload" className={tempImg === "" ? "custom-file-upload" : "custom-file-image-uploaded"}  >
                                {tempImg !== "" ? <img src={tempImg ? tempImg : noImg} width={170} style={{ display: "block " }}></img> : null}
                            </label>
                            <input
                                id="file-upload"
                                type="file"
                                accept="image/*"
                                style={{ display: "none" }}
                                onChange={processImage}
                            />
                        </Form.Item>
                        <Form.Item label="Bio" name="bio">
                            <TextArea allowClear maxLength={100} />
                        </Form.Item>
                        <Form.Item label="Username" name="username">
                            <Input placeholder="input placeholder" disabled />
                        </Form.Item>
                        <Form.Item label="UserType" name="usertype">
                            <Input placeholder="input placeholder" disabled />
                        </Form.Item>
                        <Form.Item label="PhoneNumber" name="phonenumber">
                            <Input placeholder="input placeholder" disabled />
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
                    </Form>
                </div>
            </div >
        </div>
    )
}
export default CompleteProfile

