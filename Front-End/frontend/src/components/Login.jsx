import React, { useState } from 'react';
import axios from "axios";
import { useEffect } from 'react'; // You import `useState` twice. Removed the extra one.
import './Login.css';
import { FaUser, FaLock } from "react-icons/fa";
import { Link } from 'react-router-dom';
import Navbar from './navigation.jsx';

const Login = () => {
   if(localStorage.getItem('isLogged')){
      window.location.href = '/';
   }
   const [email, setEmail] = useState('');
   const [password, setPassword] = useState('');
   const [message, setMessage] = useState({ content: '', className: '' });

   const submit = async e => {
      e.preventDefault();
      const user = {
         email: email,
         password: password
      };

      try {
         const { data } = await axios.post('http://127.0.0.1:8000/timeapp/api/login/', user, {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true
         });

         localStorage.clear();
         if (data["is_active"] === false) {
            setMessage({ content: "Please activate your account first. Check your Email", className: 'text-red-500' });
         } else {
            localStorage.setItem('access_token', data["tokens"]["access"]);
            localStorage.setItem('refresh_token', data["tokens"]["refresh"]);
            localStorage.setItem('fname', data["fname"]);
            localStorage.setItem('email', data["email"]);
            localStorage.setItem('user_id', data["user_id"]);
            localStorage.setItem('institution', data["institution"]);
            localStorage.setItem('is_application_accepted', data["is_application_accepted"]);
            localStorage.setItem('is_institution_approved', data["is_institution_approved"]);
            localStorage.setItem('role', data["role"]);
            localStorage.setItem('isLogged', true);
            localStorage.setItem('isLockedOut', false);
            localStorage.setItem('hamburger_open', false);

            axios.defaults.headers.common['Authorization'] = `Bearer ${data['access']}`;
            setMessage({ content: `${data["is_application_approved"]}---${data["is_institution_approved"]}`, className: 'text-green-500' });

            // Redirect or update UI as needed
            window.location.href = '/';
         }

      } catch (error) {
         setMessage({ content: "Incorrect Password or Username", className: 'text-red-500' });
      }
   };

   return (
      <div>
         <Navbar />
         <div className='wrapper'>
            <form action="" onSubmit={submit}>
               <h1>Login</h1>
               <div className="input-box">
                  <input name="email" value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="Email" required />
                  <FaUser className='icon' />
               </div>

               <div className="input-box">
                  <input name="password" onChange={e => setPassword(e.target.value)} value={password} type="password" placeholder="Password" required />
                  <FaLock className='icon' />
               </div>

               <div className="forgot">
                  <a href="/email">Forgot password?</a>
               </div>

               <button type="submit">Login</button>

               <div className="register-link">
                  <p>Don't have an account?<Link to="/Signup">SignUp</Link></p>
               </div>

               <div className={`warning centerholder ${message.className}`}>
                  {message.content}
               </div>
            </form>
         </div>
      </div>
   );
};

export default Login;
