import React, { useState } from 'react';
import emailjs from 'emailjs-com';

import styles from './Contact.module.css';  

function Contact() {
  const [fromName, setFromName] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    emailjs.send('service_pexdesn', 'template_yq805s4', { from_name: fromName, message }, 'Sfjiu_bL7JS0rZcGY')
      .then((response) => {
         console.log('SUCCESS!', response.status, response.text);
      }, (err) => {
         console.log('FAILED...', err);
      });
  };

  return (
    <div className={styles.contact}>
      <h1>Contact</h1>
      <p>Have a question or want to work together? Send me a message!</p>
      <br></br>
      <br></br>
      <div className={styles['contact-form']}>
        <form onSubmit={handleSubmit}>
          <input type="text" name="from_name" placeholder="Your name" value={fromName} onChange={(e) => setFromName(e.target.value)} />
          <br></br>
          <br></br>
          <textarea name="message" placeholder="Your message" value={message} onChange={(e) => setMessage(e.target.value)} />
          <br></br>
          <br></br>
          <input type="submit" value="Send" />
        </form>
      </div>
    </div>
  );
}

export default Contact;