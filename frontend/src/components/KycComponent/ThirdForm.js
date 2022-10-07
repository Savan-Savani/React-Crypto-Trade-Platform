import { Button, Form, Input } from 'antd';
import React, { useState } from 'react';
import { toastErrorMessage, toastSuccessMessage } from "../../commonFunction/toastFunctions"
import { LeftCircleOutlined } from '@ant-design/icons'
import ftx1 from "../../style/images/ftx/ftx info 1.png"
import ftx2 from "../../style/images/ftx/ftx info 2.png"
import ftx3 from "../../style/images/ftx/ftx info 3.png"
import ftx4 from "../../style/images/ftx/ftx info 4.png"
import bi1 from "../../style/images/binance/bi1.png"
import bi2 from "../../style/images/binance/bi2.png"
import bi3 from "../../style/images/binance/bi3.png"
import bi4 from "../../style/images/binance/bi4.png"
import bi5 from "../../style/images/binance/bi5.png"
import axios from 'axios';
import { useNavigate } from 'react-router-dom';



const ThirdForm = () => {
    const [form] = Form.useForm();
    const navigate = useNavigate();

    const [exchangeModel, setExchangeModel] = useState(true)
    const [exchangeStepPage, setExchangeStepPage] = useState('')

    const onFinish = (values) => {
        if (values.accountName === undefined) {
            toastErrorMessage("please enter 3 or more digit Account Name");
        } else if (values.key === undefined) {
            toastErrorMessage("please input valid API key");
        } else if (values.secret === undefined) {
            toastErrorMessage("please input valid API Secret");
        } else {
            let token = localStorage.getItem('token')
            const headers = {
                'token': token,
            }
            axios.post("auth/APIkeys", { accountName: values.accountName, key: values.key, secret: values.secret }, { headers: headers }).then(async (res) => {
                if (res.data.success) {
                    toastSuccessMessage(res.data.message);
                    form.resetFields();
                    await axios.post("auth/progressStep", { step: 3 }, { headers: headers })
                    await axios.get("/user/fetchOneUserData", { headers: headers }).then((result) => {
                        localStorage.setItem("UserType", result.data.data.userType)
                        navigate("/completeProfile")
                    })
                } else {
                    toastSuccessMessage(res.data.message);
                }
            })
        }
    }
    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    return (
        exchangeModel
            ?
            <div>
                <div style={{ paddingBottom: "40px" }}>
                    <h3 className="textBlack">Fund Your Wallet To Start Investing</h3>
                    <h1 className="textBlack">ABCD offers a bank-grade secure Wallet, powered by Binance,to store your <br /> cryptocurrency.</h1>
                </div>
                <div>
                    <a onClick={() => { navigate("/completeProfile") }} style={{ color: "#1890ff", right: "15rem", top: "22rem", position: "absolute", borderBottom: "0px", fontWeight: "bold" }}>skip & Continue  </a>
                </div>
                <div className='secondForm-container'>
                    <div>
                        <h3 className="textBlack" style={{ marginLeft: "-330px", fontWeight: "bold" }} >
                            Add Funds To Your ABCD Wallet</h3>

                        <h1 className="textBlack" style={{ padding: "30px 0px" }}>Investors usually start with $10</h1>

                        <Button type='primary' className='walletButton'>Active Wallet</Button>
                        <h1 className='textBlack' style={{ padding: "30px 0px" }}>Powered by 🌎ABCD</h1>
                    </div>
                </div>
                <div className="wallet-divider">
                    <span className="line"></span>
                    <span className="divider-or">or</span>
                </div>
                <div className='secondForm-container' style={{ marginBottom: "30px", paddingTop: "60px" }}>
                    {/* <h3 className="textBlack" style={{ marginLeft: "-420px", fontWeight: "bold" }} >
                    Connect your exchange</h3> */}
                    <Button type='primary' htmlType='button' className='walletButton' onClick={() => setExchangeModel(false)} >Connect your exchange</Button>
                </div>
            </div >
            :
            exchangeStepPage === ''
                ?
                <div style={{ marginBottom: "50px" }}>
                    <div style={{ display: "flex" }}>
                        <LeftCircleOutlined style={{ padding: "8px 10px 0px 20px" }} onClick={() => setExchangeModel(true)} />
                        <h3 className="textBlack" style={{ fontWeight: "bold" }} >
                            select your Exchange</h3>
                    </div>
                    <div style={{ border: "1px solid #bcbcbc", content: "", width: "100%" }}></div>
                    <div style={{ display: "grid", justifyContent: "center" }}>
                        <Button type='ghost' style={{ marginTop: "20px" }} onClick={() => setExchangeStepPage("BINANCE")}>BINANCE</Button>
                        <Button type='ghost' style={{ marginTop: "20px" }} onClick={() => setExchangeStepPage("FTX")}>FTX</Button>
                    </div>
                </div>
                :
                exchangeStepPage === "FTX"
                    ?
                    <div style={{ marginBottom: "50px" }}>
                        <div style={{ display: "flex" }}>
                            <LeftCircleOutlined style={{ padding: "8px 10px 0px 20px" }} onClick={() => setExchangeStepPage('')} />
                            <h3 className='textBlack'>Follow steps to connect FTX</h3>
                        </div>
                        <div className='secondForm-container' style={{ overflowY: "auto", paddingLeft: "15px" }}>

                            <div className="exchange-tutorials" style={{ maxHeight: "400px" }}>
                                <div className="step-bold" style={{ fontSize: "20px" }}>
                                    Step 1: Create API Key on FTX</div>
                                <div className="step-list-item">
                                    Go to https://ftx.com and click on your profile name on the top right.<br /> Navigate to Settings &gt; API &gt;
                                    <span className="step-bold">Create API key</span>
                                </div>
                                <div style={{ padding: "10px 0px 10px 50px" }}>
                                    <img src={ftx1} alt="ftx_instruction_1" width={500} />
                                </div>
                                <div className="step-bold" style={{ fontSize: "20px" }}>
                                    Step 2: Configure the API Key</div>
                                <div className="step-list-item">
                                    <b className="step-bold">Step 2:</b>
                                    You should see a popup as shown below. Do not close this popup.
                                </div>
                                <div style={{ padding: "10px 0px 10px 50px" }}>
                                    <img src={ftx2} alt="ftx_instruction_2" width={500} />
                                </div>
                                <div className="step-list-item">
                                    Copy the API Key and Secret and paste it in the next step.<br /> Click Submit and your key should appear on the Connect exchange page.<section>
                                        You should also see the status as 'Active' for the added key.<br />
                                        In case you wish to add a subaccount, select the 'Is this a subaccount?' box and <br />enter the name of the subaccount in the box below it.</section>
                                    <section>
                                        Make sure the name of the subaccount is exactly same as the subaccount on FTX.</section>
                                </div>
                                <div style={{ padding: "10px 0px 10px 50px" }}>
                                    <img src={ftx3} alt="ftx_instruction_3" width={500} />
                                </div>
                                <div className="step-list-item">
                                    Note: Please make sure your API Key has enabled Trading Permissions and you have verified your FTX account. </div>
                                <div style={{ padding: "10px 0px 10px 50px" }}>
                                    <img src={ftx4} alt="ftx_instruction_4" width={500} />
                                </div>
                            </div>
                        </div>
                        <div>
                            <Button type='primary' style={{ width: "150px", height: "40px", borderRadius: "5px", margin: "20px 0px 0px 500px" }} onClick={() => setExchangeStepPage("KEYS")}>Continue</Button>
                        </div>

                    </div >
                    :
                    exchangeStepPage === "BINANCE"
                        ?
                        <div style={{ marginBottom: "50px" }}>
                            <div style={{ display: "flex" }}>
                                <LeftCircleOutlined style={{ padding: "8px 10px 0px 20px" }} onClick={() => setExchangeStepPage('')} />
                                <h3 className='textBlack'>Follow steps to connect BINANCE</h3>
                            </div>
                            <div className='secondForm-container' style={{ overflowY: "auto", paddingLeft: "15px" }}>
                                <div className="exchange-tutorials" style={{ maxHeight: "400px" }}>
                                    <div className="step-bold" style={{ fontSize: "20px" }}>
                                        Step 1: Create API Key on Binance US</div>
                                    <div className="step-list-item">
                                        Click on the profile section tab next to to the orders section and select API Management </div>
                                    <div style={{ padding: "10px 0px 10px 50px" }}>
                                        <img src={bi1} width={500} alt="binance_instructions_1" />
                                    </div>
                                    <div className="step-list-item">
                                        Give your Label API key a name of your choice and click on create API </div>
                                    <div style={{ padding: "10px 0px 10px 50px" }}>
                                        <img src={bi2} width={500} alt="binance_instructions_2" />
                                    </div>
                                    <div className="step-list-item">
                                        You will now see an API key created with the label name provided in Step-1 </div>
                                    <div style={{ padding: "10px 0px 10px 50px" }}>
                                        <img src={bi3} width={500} alt="binance_instructions_3" />
                                    </div>
                                    <div className="step-bold" style={{ fontSize: "20px" }}>
                                        Step 2: Configure the API Key</div>
                                    <div className="step-list-item">
                                        Click on Edit restrictions and Enable Spot &amp; Margin Trading, this ensures that ABCD can place orders on your behalf. </div>
                                    <div style={{ padding: "10px 0px 10px 50px" }}>
                                        <img src={bi4} width={500} alt="binance_instructions_4" />
                                    </div>
                                    <div className="step-list-item">
                                        Copy and paste the API key and the secret in the dialog box on the next screen.</div>
                                    <div style={{ padding: "10px 0px 10px 50px" }}>
                                        <img src={bi5} width={500} alt="binance_instructions_6" />
                                    </div>
                                    <div className="step-list-item">
                                        Copy the below mentioned IP Addresses from ABCD and paste them under the 'Restrict access to the trusted IPs' section. </div>
                                    <span className="ip-address-title-and-copy">
                                        <span className="ip-address-title">
                                            IP Addresses</span>
                                        <span className="copy-icon">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                                <path d="M0 0h24v24H0V0z" fill="none">
                                                </path>
                                                <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z">
                                                </path>
                                            </svg>
                                        </span>
                                    </span>
                                    <div className="ip-address-block">
                                        <div className="ip-address">
                                            <div className="ip-address-text">
                                                3.94.44.146</div>
                                            <div className="ip-address-text">
                                                34.200.151.171</div>
                                            <div className="ip-address-text">
                                                184.73.95.117</div>
                                            <div className="ip-address-text">
                                                54.163.141.2</div>
                                            <div className="ip-address-text">
                                                54.81.248.37</div>
                                            <div className="ip-address-text">
                                                54.88.23.9</div>
                                            <div className="ip-address-text">
                                                52.200.53.174</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <Button type='primary' style={{ width: "150px", height: "40px", borderRadius: "5px", margin: "20px 0px 0px 500px" }} onClick={() => setExchangeStepPage("KEYS")}>Continue</Button>
                            </div>
                        </div>
                        :
                        exchangeStepPage === "KEYS"
                            ?
                            <div style={{ marginBottom: "50px" }}>
                                <div style={{ display: "flex" }}>
                                    <LeftCircleOutlined style={{ padding: "8px 10px 0px 20px" }} onClick={() => setExchangeStepPage('')} />
                                    <h3 className='textBlack'>Enter API & Secret keys</h3>
                                </div>
                                <div className='secondForm-container' style={{ paddingLeft: "15px" }}>
                                    <Form
                                        form={form}
                                        layout="vertical"
                                        onFinish={onFinish}
                                        onFinishFailed={onFinishFailed}
                                    >
                                        <Form.Item label="Account Name" name="accountName">
                                            <Input placeholder="input placeholder" />
                                        </Form.Item>
                                        <Form.Item label="API key" name="key">
                                            <Input placeholder="input placeholder" />
                                        </Form.Item>
                                        <Form.Item label="API Secret" name="secret">
                                            <Input placeholder="input placeholder" />
                                        </Form.Item>
                                        <Form.Item>
                                            <Button type="primary" htmlType="submit">Connect Exchange</Button>
                                        </Form.Item>
                                    </Form>
                                </div>
                            </div>
                            :
                            setExchangeStepPage("")
    );
};

export default ThirdForm;