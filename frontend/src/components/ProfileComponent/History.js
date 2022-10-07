import { Table } from 'antd'
import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { toastErrorMessage } from "../../commonFunction/toastFunctions"
import { MyContext } from '../../pages/ProfilePage';


function History() {

    const { walletData } = useContext(MyContext)

    let token = localStorage.getItem('token')
    const headers = {
        'token': token,
    }

    const [historyData, setHistoryData] = useState([])
    useEffect(() => {
        axios.get("/transaction/history", { headers }).then((res) => {
            if (res.data.success) {
                setHistoryData(res.data.data)
            } else {
                toastErrorMessage(res.data.message);
            }
        })
    }, [walletData])

    const columns = [
        {
            title: 'Coin',
            dataIndex: 'coin',
            key: 'coin',
            render: (text) => <div >{text}</div>
        },
        {
            title: 'Number of coin',
            dataIndex: 'coinCount',
            key: 'coinCount',
            render: (text) => <div style={{ textAlign: "center" }}>{text.toFixed(4)}</div>,
        },
        {
            title: 'Action',
            dataIndex: 'action',
            key: 'action',
            render: (text) => <div >{text.toUpperCase()}</div>,
        }
    ];

    return (
        <div style={{ height: "200px", width: "400px", border: "1px dashed grey" }}>
            <div>
                <h1 style={{ textAlign: "center", paddingTop: "5px" }} className='textBlack'>Transaction History</h1>
            </div>
            <div >
                <Table columns={columns} dataSource={historyData} scroll={{ y: 200, x: 1 }} />
            </div>
        </div>
    )
}

export default History