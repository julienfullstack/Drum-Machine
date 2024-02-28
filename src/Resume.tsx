import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

import styles from './Resume.module.css';

function Resume() {
  return (
    <div className="resume">
      <div className="resume-header">
        <h1>Your Name</h1>
        <p>Your Title</p>
      </div>

      <div className="resume-section">
        <h2>Experience</h2>
        {/* Add your experience here */}
      </div>

      <div className="resume-section">
        <h2>Education</h2>
        {/* Add your education here */}
      </div>

      {/* Add more sections as needed */}
    </div>
  );
}

export default Resume;