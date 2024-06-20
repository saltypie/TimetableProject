import React, { useState } from 'react';
import './Login.css';
import { Link } from 'react-router-dom';
import {FaLock } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import Navbar from './navigation.jsx';
import axios from "axios";


const Signup = () => {
  if(localStorage.getItem('isLogged')){
    window.location.href = '/';
 }
 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [lname, setLname] = useState('');
  const [fname, setFname] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');


  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    // Check email format and set custom validity if not valid
    if (!isValidEmail(e.target.value)) {
      e.target.setCustomValidity('Please enter a valid email address');
    } else {
      e.target.setCustomValidity('');
    }
  };

  const isValidEmail = (email) => {
    // Regular expression for validating email format
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };
  const handleLnameChange = (e) => {
    setLname(e.target.value);
  } 

  const handleFnameChange = (e) => {
    setFname(e.target.value);
  }

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
    setPasswordMatch(e.target.value === password);
  };


  const submit = async e => {
    e.preventDefault();
    const body = {
          email: email,
          fname: fname,
          lname: lname,
          password: password
         };
    // Create the POST request
    try {
       const {data} = await                                                                            
                      axios.post('http://127.0.0.1:8000/timeapp/api/register/', body ,{headers: {'Content-Type': 'application/json'}}, {withCredentials: true});
        if(data.Message){
          alert(data["Message"]);
          setErrorMessage(data.Message);
        }else{
          window.location.href = '/login/';
        }
    } catch (error) {
       setErrorMessage("Incorrect Details");
    }
       
 }  

  return (
    <div>
      <Navbar />
      <div className='wrapper'>
        <form action="" onSubmit={submit}>
          <h1>Signup</h1>
          <div className="input-box">
            <input 
              name="email"
              type="email" 
              placeholder="Email" 
              value={email} 
              onChange={handleEmailChange} 
              required 
            />
            <MdEmail className='icon'/>
            <span className="info" title="Your email must be a valid email address.">ℹ️</span>
          </div>

          <div className="input-box">
            <input name="fname" value={fname} onChange={handleFnameChange} type="text" placeholder="First Name" required />
          </div>

          <div className="input-box">
            <input name="lname" value={lname} onChange={handleLnameChange} type="text" placeholder="Last Name" required />
          </div>

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

          <button type="submit" disabled={!passwordMatch}>SignUp</button>

          <div className="register-link">
            <p>Already have an account?<Link to="/Login">Login</Link></p>
          </div>

          <div className="warning centerholder">
                  {errorMessage}
          </div>
        </form>    
      </div>
    </div>
  );
}

export default Signup;
