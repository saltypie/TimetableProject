import React from 'react';
import axios from "axios";
import{useEffect, useState} from 'react';

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
   const [errorMessage, setErrorMessage] = useState('');

   const submit = async e => {
      e.preventDefault();
      const user = {
            email: email,
            password: password
           };
      // Create the POST requuest
      try {
         const {data} = await                                                                            
                        axios.post('http://127.0.0.1:8000/timeapp/api/login/', user ,{headers: {'Content-Type': 'application/json'}}, {withCredentials: true});
                        // axios.post('http://127.0.0.1:8000/timeapp/api/login/', user ,{headers: {'Content-Type': 'application/json'}}, {withCredentials: true});
   
        // Initialize the access & refresh token in localstorage.      
        localStorage.clear();
        if(data["is_active"]==false){
           alert("Please activate your account first. Check your Email")
        }else{
           localStorage.setItem('access_token', data["tokens"]["access"]);
           localStorage.setItem('refresh_token', data["tokens"]["refresh"]);
           localStorage.setItem('fname', data["fname"]);
           localStorage.setItem('email', data["email"]);
           localStorage.setItem('isLogged', true);
           localStorage.setItem('isLockedOut', false);

           axios.defaults.headers.common['Authorization'] =`Bearer ${data['access']}`;
           window.location.href = '//';
        }

      } catch (error) {
         setErrorMessage("Incorrect Password or Username");
      }
         
   }   

   
   return (
      <div><Navbar  />
      <div className='wrapper'>
         <form action="" onSubmit={submit}>
            <h1>Login</h1>
               <div className="input-box">
                  <input name="email" value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="mail" required />
                  <FaUser className='icon'/>
               </div>

               <div className="input-box">
                  <input name="password" onChange={e => setPassword(e.target.value)} value={password} type="password" placeholder="Password" required />
                  <FaLock className='icon'/>
               </div>

               <div className="forgot">
                  <a href="/email">Forgot password?</a>
               </div>
               
               <button type="submit">Login</button>

               <div className="register-link">
                  <p>Don't have an account?<Link to="/Signup">SignUp</Link></p>
               </div>
               <div className="warning centerholder">
                  {errorMessage}
               </div>
         </form>    
      </div></div>
   )
}

export default Login