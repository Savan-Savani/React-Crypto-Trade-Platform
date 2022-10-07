import { Button, Form, Input } from 'antd';
import axios from 'axios';
import React, { useState } from 'react';
import { toastErrorMessage, toastSuccessMessage } from "../../commonFunction/toastFunctions"



const SecondForm = ({ props }) => {
    const [form] = Form.useForm();
    const [otpForm] = Form.useForm();
    const [isOtpSended, setIsOtpSended] = useState(true)

    const onFinish = async (values) => {

        if (values.MobileNo === undefined) {
            toastErrorMessage("please enter Mobile NO.");
        } else if (values.MobileNo.length !== 10) {
            toastErrorMessage("please enter 10 digit Mobile NO.");
        }
        else {
            let token = localStorage.getItem('token')
            const headers = {
                'token': token,
            }
            await axios.post("auth/phoneCode", { phoneNumber: values.MobileNo }, { headers: headers }).then((res) => {
                if (res.data.success) {
                    toastSuccessMessage(res.data.message);
                    setIsOtpSended(false)
                } else {
                    toastSuccessMessage(res.data.message);
                    form.resetFields();
                }
            })
        }

    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    const onFinishOTP = async (values) => {
        if (values.OTP.length !== 6) {
            toastErrorMessage("please enter 6 digit OTP");
        } else {
            let token = localStorage.getItem('token')
            const headers = {
                'token': token,
            }
            await axios.post("auth/verifyOtp", { type: "phone", phoneOtp: parseInt(values.OTP) }, { headers: headers }).then(async (res) => {
                if (res.data.success) {
                    toastSuccessMessage(res.data.message);
                    form.resetFields();
                    await axios.post("auth/progressStep", { step: 2 }, { headers: headers })

                    props(2);

                } else {
                    toastSuccessMessage(res.data.message);
                }
            })
        }


    }
    return (
        <div>
            <div style={{ paddingBottom: "40px" }}>
                <h3 className="textBlack">Verify your mobile Number</h3>
            </div>
            <div className="firstPageModel">
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                >
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <Form.Item label="Mobile No." name="MobileNo"
                            rules={[
                                {
                                    type: Number,
                                    required: true
                                },
                            ]}>
                            <Input maxLength={10} style={{ width: "200%" }} />
                        </Form.Item>
                        <Button type='primary' htmlType="submit" >
                            Send OTP
                        </Button>
                    </div>
                </Form>
                <div>

                    <Form
                        form={otpForm}
                        layout="vertical"
                        onFinish={onFinishOTP}
                        onFinishFailed={onFinishFailed}
                    >
                        <div >
                            <Form.Item label="Enter OTP " name="OTP"  >
                                <Input placeholder="OTP" maxLength={6} style={{ width: "40%" }} />
                            </Form.Item>
                        </div>
                        <Form.Item>
                            <Button type="primary" htmlType="submit" disabled={isOtpSended}>Submit</Button>
                        </Form.Item>
                    </Form>
                </div>
            </div >
        </div >
    )

}

export default SecondForm;
