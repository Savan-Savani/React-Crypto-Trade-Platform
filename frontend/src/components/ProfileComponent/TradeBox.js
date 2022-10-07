import { Button, Form, Input, Modal } from 'antd'
import React, { useCallback, useContext, useState } from 'react'
import axios from "axios"
import CoinModalForm from './CoinModalForm'
import "../../style/css/tradeBox.css"
import { MyContext } from '../../pages/ProfilePage'
import { toastErrorMessage } from "../../commonFunction/toastFunctions"


function TradeBox() {

    const { setWalletData } = useContext(MyContext)

    const [form] = Form.useForm()
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [coinList, setCoinList] = useState([])
    const [inputButtonValue, setInputButtonValue] = useState("select Coin")
    const [currentCoinPrice, setCurrentCoinPrice] = useState()
    const [action, setAction] = useState("BUY")
    const [coinInWallet, setCoinInWallet] = useState([])


    let token = localStorage.getItem('token')
    const headers = {
        'token': token,
    }


    const onFinish = async (values) => {
        if (action === "BUY") {
            await axios.get("/user/fetchOneUserData", { headers }).then(async (res) => {
                if (res.data.success) {
                    await axios.post(`/transaction/buyCoin/${res.data.data._id}`, { coin: inputButtonValue, coinCount: values.coinCount, currentCoinPrice: currentCoinPrice }, { headers }).then(async (res) => {
                        if (res.data.success) {
                            setInputButtonValue("select Coin")
                            form.setFieldsValue({ "coinCount": "", price: "" })

                            await axios.get("/wallet/fetchCurrentWallet", { headers }).then((res) => {
                                if (res.data.success) {
                                    setWalletData(res.data.data.coins)
                                } else {
                                    toastErrorMessage(res.data.message);
                                }
                            })
                        } else {
                            toastErrorMessage(res.data.message);
                        }
                    })
                } else {
                    toastErrorMessage(res.data.message);
                }
            })
        } else {
            await axios.get("/user/fetchOneUserData", { headers }).then(async (res) => {
                if (res.data.success) {
                    await axios.post(`transaction/sellCoin/${res.data.data._id}`, { coin: inputButtonValue, sellCount: parseFloat(values.coinCount), currentCoinPrice: currentCoinPrice }, { headers }).then(async (res) => {
                        if (res.data.success) {
                            setInputButtonValue("select Coin")
                            form.setFieldsValue({ "coinCount": "", price: "" })

                            await axios.get("/wallet/fetchCurrentWallet", { headers }).then((res) => {
                                if (res.data.success) {
                                    setWalletData(res.data.data.coins)
                                } else {
                                    toastErrorMessage(res.data.message);
                                }
                            })
                        } else {
                            toastErrorMessage(res.data.message);
                        }
                    })

                } else {
                    toastErrorMessage(res.data.message);
                }
            })

        }
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    const showModal = () => {
        setIsModalVisible(true);

    };

    const handleOk = () => {
        setIsModalVisible(false);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const listOfCoin = async () => {

        await axios.get("/crypto/allCryptoCoins").then(async (res) => {
            if (res.data.success) {
                setCoinList(res.data.data)
            } else {
                toastErrorMessage(res.data.message);
            }
        })
    }

    const listOfSellCoin = async () => {
        let walletCoinArray = []
        await axios.get("/crypto/allCryptoCoins").then(async (res) => {
            if (res.data.success) {
                let allCoin = res.data.data
                await axios.get("/wallet/fetchCurrentWallet", { headers }).then(async (e) => {
                    if (e.data.success) {
                        setCoinInWallet(e.data.data.coins)
                        await e.data.data.coins.map((key, i) => {
                            walletCoinArray.push(key.coin)
                        })
                        let list = allCoin.filter(item => walletCoinArray.includes(item.symbol.toUpperCase()))
                        setCoinList(list)
                    } else {
                        toastErrorMessage(e.data.message);
                    }
                })
            } else {
                toastErrorMessage(res.data.message);
            }
        })
    }
    const callback = useCallback(async (e) => {
        setIsModalVisible(false)
        setInputButtonValue(e.symbol.toUpperCase())
        setCurrentCoinPrice(e.current_price)

    }, [])

    return (
        <div style={{ height: "auto", width: "200px", border: "1px dashed grey" }}>
            <div style={{ display: "flex" }} className='tradeAction'>
                <div onClick={() => { setAction("BUY") }} style={{ height: "auto", width: "100px", borderRight: "1px dashed grey", textAlign: 'center', cursor: "pointer" }} className={action !== "BUY" ? "action" : ""} >
                    BUY
                </div>
                <div onClick={() => { setAction("SELL") }} style={{ height: "auto", width: "100px", textAlign: "center", cursor: "pointer" }} className={action !== "SELL" ? "action" : ""}>
                    SELL
                </div>
            </div>
            <div className='tradeBox'>
                <Form
                    form={form}
                    name="basic"
                    labelCol={{
                        span: 14,
                    }}
                    wrapperCol={{
                        span: 20,
                    }}
                    initialValues={{
                        remember: true,
                    }}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                >
                    <Form.Item
                        label="Coin"
                        rules={[
                            {
                                required: true,
                            },
                        ]}
                    >
                        <Input type='button' className='inputButton' value={inputButtonValue}
                            onClick={action === "BUY" ? () => { listOfCoin(); showModal(); } : () => { listOfSellCoin(); showModal(); }}
                        />

                        <Modal title="" width="80%" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel} footer={null} closable={false}>
                            <CoinModalForm props={coinList.length !== 0 ? coinList : ""} callback={callback} tradeType={action} />
                        </Modal>

                    </Form.Item>
                    <Form.Item
                        name="coinCount"
                        label="Amount"
                        rules={[
                            {
                                required: true,
                            },
                            {
                                message: "not enough coin in wallet for sell",
                                validator: async (_, value) => {
                                    if (action === "SELL") {
                                        let selectedCoin = coinInWallet.filter(item => inputButtonValue.includes(item.coin))
                                        if (value >= selectedCoin[0].coinCount) {
                                            return Promise.reject('Some message here');

                                        } else {
                                            return Promise.resolve();
                                        }
                                    } else {
                                        return Promise.resolve();
                                    }
                                }
                            }
                        ]}
                    >
                        <Input type="text" onChange={action === "SELL" ? (e) => { form.setFieldsValue({ price: currentCoinPrice ? (e.target.value * currentCoinPrice).toFixed(2) : 0, coinCount: e.target.value }); } : (e) => { form.setFieldsValue({ price: currentCoinPrice ? (e.target.value * currentCoinPrice).toFixed(2) : 0, coinCount: e.target.value }); }} />
                    </Form.Item>
                    <Form.Item
                        name="price"
                        label="Price/USD"
                        rules={[
                            {
                                required: true,
                            },
                            {
                                message: "not enough coin in wallet for sell",
                                validator: async (_, value) => {
                                    if (action === "SELL") {
                                        let selectedCoin = coinInWallet.filter(item => inputButtonValue.includes(item.coin))
                                        if (value >= selectedCoin[0].coinCount * currentCoinPrice) {
                                            return Promise.reject('Some message here');

                                        } else {
                                            return Promise.resolve();
                                        }
                                    } else {
                                        return Promise.resolve();
                                    }
                                }
                            }
                        ]}

                    >
                        <Input type='text'
                            onChange={(e) => { form.setFieldsValue({ price: e.target.value, coinCount: currentCoinPrice ? (e.target.value / currentCoinPrice).toFixed(3) : 0 }) }}
                        />
                    </Form.Item>
                    <Form.Item
                        wrapperCol={{
                            offset: 8,
                            span: 16,
                        }}
                    >
                        {
                            action === "BUY" ?
                                <Button type="primary" htmlType="submit">
                                    BUY
                                </Button>
                                :
                                <Button type="primary" htmlType="submit">
                                    SELL
                                </Button>
                        }
                    </Form.Item>
                </Form>
            </div>
        </div>
    )
}

export default TradeBox