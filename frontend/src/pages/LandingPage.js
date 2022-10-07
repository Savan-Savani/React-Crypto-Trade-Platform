import React from "react"
import Footer from '../components/LandingPageComponents/Footer';
import Header from '../components/LandingPageComponents/Header';
import HomePage from '../components/LandingPageComponents/Home';

function LandingPage() {
  return (
    <div className="is-preload landing">
      <div id="page-wrapper">
        <Header />
        <HomePage />
        <Footer />
      </div>
    </div>
  );
}

export default LandingPage;
