import React from "react"
import Detail from '../components/LandingPageComponents/Detail';
import Footer from '../components/LandingPageComponents/Footer';
import Header from '../components/LandingPageComponents/Header';

function DetailPage() {
  return (
    <div className="is-preload landing">
      <div id="page-wrapper">
        <Header />
        <Detail />
        <Footer />
      </div>
    </div>
  );
}

export default DetailPage;