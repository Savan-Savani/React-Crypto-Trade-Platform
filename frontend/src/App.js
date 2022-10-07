import './App.css';
import React from 'react'
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import LandingPage from './pages/LandingPage';
import KycPage from './pages/KycPage';
import "./style/landingPage.css"
import DetailPage from './pages/DetailPage';
import SelectUserPage from './pages/SelectUserPage';
import { ToastContainer } from 'react-toastify';
import ExpertDashboardPage from './pages/ExpertDashboardPage';
import InvestorDashboardPage from './pages/InvestorDashboardPage';
import CompleteProfilePage from './pages/CompleteProfilePage';
import ProfilePage from './pages/ProfilePage';

function App() {

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route exact path="/" element={<LandingPage />} />
          <Route exact path="/detail" element={<DetailPage />} />
          <Route exact path="/userselect" element={<SelectUserPage />} />
          <Route exact path="/kyc" element={<PrivateRoute><KycPage /></PrivateRoute>} />
          <Route exact path="/dashboard" element={localStorage.getItem("UserType") === "Expert" ? <PrivateRoute><ExpertDashboardPage /></PrivateRoute> : <PrivateRoute><InvestorDashboardPage /></PrivateRoute>} />
          <Route exact path='/completeProfile' element={<PrivateRoute><CompleteProfilePage /></PrivateRoute>} />
          <Route exact path='/profile' element={<PrivateRoute><ProfilePage /></PrivateRoute>}></Route>
        </Routes>
      </BrowserRouter>
      <ToastContainer
        position="top-right"
        autoClose={1000}
        hideProgressBar
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div >
  );
}

function PrivateRoute({ children }) {
  return localStorage.getItem("token") ? children : <Navigate to="/" />;
}



export default App;
