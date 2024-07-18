import React, { useState } from 'react';
import './Login.css';
import { FaLock } from "react-icons/fa";
import axios from "axios";
import { useParams } from 'react-router-dom';
import Navbar from './navigation';

const ChangePassword = () => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [passwordMatch, setPasswordMatch] = useState(true);
  // const [errorMessage, setErrorMessage] = useState(true);
  const {id} = useParams();//Q?
  
  const handleOldPasswordChange = (e) => {
    setOldPassword(e.target.value);
  };
  const handleNewPasswordChange = (e) => {
    setNewPassword(e.target.value);
  };
  const handleConfirmNewPasswordChange = (e) => {
    setConfirmNewPassword(e.target.value);
    setPasswordMatch(e.target.value === newPassword);
  };

  const submit = async (e) => {
    e.preventDefault();

    if (!passwordMatch) return;

    const data = {
      new_password: newPassword,
      old_password: oldPassword
    };

    try {
      console.log('Submitting data:', data);

      const response = await axios.put(`http://127.0.0.1:8000/timeapp/api/change_pass/`, data, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        }
      });

      console.log('Response:', response.data);

      alert('Password reset successful!');
      console.log('Password reset successful!');
      window.location.href='/You';
    } catch (error) {
      console.error('Error:', error);
      alert(error.response.data.Message);
    }
  };

  return (
    <div><Navbar title="Home"/>
      <div className='wrapper'>
        <form onSubmit={submit}>
          <h1>Reset Password</h1>

          <div className="input-box">
            <input 
              name="oldPassword"
              type="password" 
              placeholder="Old Password" 
              value={oldPassword} 
              onChange={handleOldPasswordChange} 
              required  
            />
            <FaLock className='icon'/>
          </div>

          <div className="input-box">
            <input 
              name="newPassword"
              type="password" 
              placeholder="New Password" 
              value={newPassword} 
              onChange={handleNewPasswordChange} 
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
              placeholder="Confirm New Password" 
              value={confirmNewPassword} 
              onChange={handleConfirmNewPasswordChange} 
              required 
            />
            {passwordMatch ? null : <span style={{ color: 'red' }}>Passwords do not match</span>}
          </div>
          <button type="submit" disabled={!passwordMatch}>Submit</button>
          <span className="info" title="">ℹ️</span>

        </form>    
      </div>
    
    </div>
  );
};

export default ChangePassword;