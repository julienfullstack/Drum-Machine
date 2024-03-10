import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

import styles from './Resume.module.css';

function Resume() {
  return (
    <div className={styles.resume}>
      <div className={styles['resume-header']}>
        <h1>Julien Lenaz</h1>
        <p>With a deep understanding of human behavior, cognition, and problem-solving from over 7 years of research and social service experience, I bring a user-centric approach to programming challenges.</p>
      </div>
      <div className={styles['resume-section']}>
        <h2>Skills</h2>
        <ul>
          <li>Javascript</li>
          <li>React</li>
          <li>HTML</li>
          <li>CSS</li>
          <li>Node.js</li>
          <li>C#</li>
          <li>SQL</li>
          <li>SPSS/Python</li>
        </ul>
      </div>
      <br></br>
      {/* <div className={styles['resume-section']}>
        <h2></h2>
        {}
      </div>
      <div className={styles['resume-section']}>
        <h2></h2>
        {  }
      </div>
      {} */}
      <a href="./Resume.pdf" download="Resume.pdf">Download Resume</a>
    </div>
  );
}

export default Resume;