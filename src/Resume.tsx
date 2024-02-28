import React from 'react'
import ReactDOM from 'react-dom/client'

const Resume = () => {
  return (
    <div>
      <h1>John Doe</h1>
      <h2>Software Developer</h2>

      <section>
        <h3>Contact Information</h3>
        <p>Email: john.doe@example.com</p>
        <p>Phone: 123-456-7890</p>
      </section>

      <section>
        <h3>Skills</h3>
        <ul>
          <li>JavaScript</li>
          <li>React</li>
          <li>Node.js</li>
        </ul>
      </section>

      <section>
        <h3>Experience</h3>
        <h4>Software Developer at XYZ Company</h4>
        <p>Jan 2020 - Present</p>
        <p>Developed web applications using JavaScript and React.</p>
      </section>

      <section>
        <h3>Education</h3>
        <h4>Bachelor of Science in Computer Science</h4>
        <p>XYZ University, 2016 - 2020</p>
      </section>
    </div>
  );
};

export default Resume;