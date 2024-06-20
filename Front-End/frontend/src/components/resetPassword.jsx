import React, { useState } from 'react';
import './Login.css';
import { FaLock } from "react-icons/fa";
import axios from "axios";
import { useParams } from 'react-router-dom';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMatch, setPasswordMatch] = useState(true);
  // const [errorMessage, setErrorMessage] = useState(true);
  const {id} = useParams();
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
    setPasswordMatch(e.target.value === password);
  };

  const submit = async (e) => {
    e.preventDefault();

    if (!passwordMatch) return;

    const data = {
      password: password,
      id:id
    };

    try {
      console.log('Submitting data:', data);

      const response = await axios.post(`http://127.0.0.1:8000/timeapp/api/new_pass/`, data, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log('Response:', response.data);

      alert('Password reset successful!');
      console.log('Password reset successful!');
      window.location.href='/login'
    } catch (error) {
      
      console.error('Error:', error);
    }
  };

  return (
    <div className='wrapper'>
      <form onSubmit={submit}>
        <h1>Reset Password</h1>

        <div className="input-box">
          <input 
            name="password"
            type="password" 
            placeholder="Password" 
            value={password} 
            onChange={handlePasswordChange} 
            required 
            pattern="^(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$" 
            title="Password must be at least 8 characters long and contain at least one symbol" 
          />
          <FaLock className='icon'/>
          <span className="info" title="Your password must be at least 8 characters long and contain at least one symbol.">ℹ️</span>
        </div>

        <div className="input-box">
          <input 
            type="password" 
            placeholder="Confirm Password" 
            value={confirmPassword} 
            onChange={handleConfirmPasswordChange} 
            required 
          />
          {passwordMatch ? null : <span style={{ color: 'red' }}>Passwords do not match</span>}
        </div>
        <button type="submit" disabled={!passwordMatch}>Submit</button>

      </form>    
    </div>
  );
};

export default ResetPassword;