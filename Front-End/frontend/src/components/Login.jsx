import React from 'react';
import './Login.css';
import { FaUser, FaLock } from "react-icons/fa";
import { Link } from 'react-router-dom';
import Navbar from './navigation.jsx';

const Login = () => {
  return (
    <div><Navbar  />
    <div className='wrapper'>
        <form action="">
            <h1>Login</h1>
             <div className="input-box">
                <input type="email" placeholder="Username" required />
                <FaUser className='icon'/>
             </div>

             <div className="input-box">
                <input type="password" placeholder="Password" required />
                <FaLock className='icon'/>
             </div>

             <div className="forgot">
                <a href="#">Forgot password?</a>
             </div>
             
             <button type="submit">Login</button>

             <div className="register-link">
                <p>Don't have an account?<Link to="/Signup">SignUp</Link></p>
             </div>

        </form>    
    </div></div>
  )
}

export default Login