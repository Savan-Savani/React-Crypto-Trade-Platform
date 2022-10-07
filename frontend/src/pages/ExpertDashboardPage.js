import React, { useState } from "react"
import DashboardHeader from "../components/DashboardComponents/DashboardHeader"
import History from "../components/DashboardComponents/ExpertDashboard/History";
import TradeBox from "../components/DashboardComponents/ExpertDashboard/TradeBox";
import ExpertDashboard from "../components/DashboardComponents/ExpertDashboard/ExpertDashboard";
import Wallet from "../components/DashboardComponents/ExpertDashboard/Wallet";


export const DashboardContext = React.createContext()


const ExpertDashboardPage = () => {
    const [walletData, setWalletData] = useState([]);

    return (
        <div >
            <DashboardHeader />
            <ExpertDashboard />
            <DashboardContext.Provider value={{ walletData, setWalletData: walletData => setWalletData(walletData) }}>
                <div style={{ display: "flex", justifyContent: "space-around" }}>
                    <Wallet />
                    <History />
                    <TradeBox />
                </div>
            </DashboardContext.Provider>

        </div>
    );
}

export default ExpertDashboardPage;
