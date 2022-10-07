import React from 'react'
import { Table } from 'antd';
import { MinusCircleOutlined, PlusCircleOutlined } from '@ant-design/icons';

const CoinModalForm = ({ props, callback, tradeType }) => {

    const columns = [
        {
            title: 'Image',
            dataIndex: 'image',
            key: 'image',
            render: (text) => <img src={text} width="25px" />,
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            render: (text) => <div>{text}</div>,
        },
        {
            title: 'Symbol',
            dataIndex: 'symbol',
            key: 'symbol',
            render: (text) => <div >{text.toUpperCase()}</div>,
        },
        {
            title: 'Price / USD',
            dataIndex: 'current_price',
            key: 'current_price',
        },
        {
            title: '24h %',
            dataIndex: 'price_change_percentage_24h',
            key: 'price_change_percentage_24h',
            render: (text) => (<div>{text.toFixed(2)}</div>)
        },
        {
            title: 'Action',
            dataIndex: 'action',
            key: 'action',
            render: (_, record) => tradeType === "BUY" ? (<div onClick={() => { callback(record); }}><PlusCircleOutlined /></div>) : (<div onClick={() => { callback(record); }}><MinusCircleOutlined /></div>)
        },
    ];

    return (
        <div>
            <Table columns={columns} dataSource={props} />
        </div>

    )
}

export default CoinModalForm