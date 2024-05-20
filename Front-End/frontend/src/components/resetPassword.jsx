import React, { useState } from 'react';
import './Login.css';
import {FaLock } from "react-icons/fa";


const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMatch, setPasswordMatch] = useState(true);

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
      };
    
      const handleConfirmPasswordChange = (e) => {
        setConfirmPassword(e.target.value);
        setPasswordMatch(e.target.value === password);
      };

  return (

      <div className='wrapper'>
        <form action="">
          <h1>Reset Password</h1>

          <div className="input-box">
            <input 
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

          <button type="submit" disabled={!passwordMatch}>SignUp</button>

        </form>    
      </div>
  )
}

export default ResetPassword