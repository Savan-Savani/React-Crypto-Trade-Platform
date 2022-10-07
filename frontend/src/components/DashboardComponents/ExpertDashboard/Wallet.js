import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { DashboardContext } from '../../../pages/ExpertDashboardPage';
import { toastErrorMessage } from "../../../commonFunction/toastFunctions"


const Wallet = () => {

    const { walletData } = useContext(DashboardContext)

    const [coinList, setCoinList] = useState([])

    let token = localStorage.getItem('token')
    const headers = {
        'token': token,
    }

    useEffect(async () => {

        await axios.get("/wallet/fetchCurrentWallet", { headers }).then((res) => {
            if (res.data.success) {
                setCoinList(res.data.data.coins)
            } else {
                toastErrorMessage(res.data.message);
            }
        })
    }, [walletData])


    return (
        <div style={{ height: "auto", width: "200px", border: "1px dashed grey" }}>
            <div >
                <h1 style={{ textAlign: "center", color: 'black' }}>wallet</h1>
            </div>
            <div style={{ display: "flex", justifyContent: "space-around", marginBottom: "10px" }}>
                <div style={{ borderBottom: "1px dotted black" }}>coin</div>
                <div style={{ borderBottom: "1px dotted black" }}>amount</div>
            </div>
            <div >
                {coinList.map((key, i) => {
                    return (
                        <div style={{ display: "flex", justifyContent: "space-around" }} key={i}>
                            <div>
                                {key.coin}
                            </div>
                            <div>{key.coinCount.toFixed(3)}</div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default Wallet