// LandingPage.js
import React from 'react';
import { Link } from 'react-router-dom';
import "./LandingPage.css"

const LandingPage = () => {
  return (
    <div className="landing-page">
      <h1 className="title">Vietnam Weather Data</h1>
      <p className="subtitle">DataScience and Data Visualization </p>
      <Link to="/dashboard" className="link">dashboard</Link>
    </div>
  );
};

export default LandingPage;