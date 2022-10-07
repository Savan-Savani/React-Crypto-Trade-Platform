import React from "react"
import { useNavigate } from "react-router-dom"

const DashboardHeader = () => {
    let navigate = useNavigate()
    return (
        <div>
            <header id="header">
                <h1 id="logo" className="logo">
                    <a >Landed</a>
                </h1>
                <nav id="nav">
                    <ul>
                        <li className="opener">
                            <a >know more?</a>
                        </li>
                        <li>
                            <a className="button primary" onClick={() => {
                                localStorage.clear();
                                navigate("/");
                            }}
                            >Logout</a>
                        </li>
                    </ul>
                </nav>
            </header>
        </div >
    )
}
export default DashboardHeader