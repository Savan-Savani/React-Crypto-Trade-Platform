import React, { createContext, useState } from "react"
import Header from "../components/CompleteProfileComponent.js/Header"
import History from "../components/ProfileComponent/History"
import Profile from "../components/ProfileComponent/Profile"
import TradeBox from "../components/ProfileComponent/TradeBox"
import Wallet from "../components/ProfileComponent/Wallet"

export const MyContext = React.createContext()

const ProfilePage = () => {
    const [walletData, setWalletData] = useState([]);

    return (
        <div>
            <Header />
            <Profile />
            <MyContext.Provider value={{ walletData, setWalletData: walletData => setWalletData(walletData) }}>
                <div style={{ display: "flex", justifyContent: "space-around" }}>
                    <Wallet />
                    <History />
                    <TradeBox />
                </div>
            </MyContext.Provider>
        </div>
    )
}
export default ProfilePage