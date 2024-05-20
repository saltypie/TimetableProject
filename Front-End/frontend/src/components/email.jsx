import React, { useState } from 'react';
import axios from 'axios';
import { MdEmail } from 'react-icons/md';

const Email = () => {
  const [email, setEmail] = useState('');
  const [emailValid, setEmailValid] = useState(true);
  const [emailExists, setEmailExists] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setEmailValid(isValidEmail(e.target.value));
  };

  const isValidEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!emailValid) return;

    setLoading(true);

    try {
      const response = await axios.post('http://example.com/check-email', { email });

      if (response.data.exists) {
        setEmailExists(true);
        setError('');
      } else {
        setEmailExists(false);
        setError('Email does not exist. Please enter a valid email.');
      }
    } catch (error) {
      setError('Failed to check email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="wrapper">
      <form onSubmit={handleSubmit}>
        <h1>Enter Your Email</h1>

        <div className="input-box">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={handleEmailChange}
            required
          />
          <MdEmail className="icon" />
          <span className="info" title="Your email must be a valid email address.">
            ℹ️
          </span>
        </div>

        {!loading && (
          <div>
            <button type="submit">Submit</button>
          </div>
        )}

        {loading && <p>Loading...</p>}

        {error && <p className="error">{error}</p>}

        {emailExists && <p>Check your Email.</p>}
      </form>
    </div>
  );
};

export default Email;
