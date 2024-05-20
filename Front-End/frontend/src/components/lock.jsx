import React from 'react';
import './Login.css';
import { FaLock } from "react-icons/fa";
import { Link } from 'react-router-dom';
import axios from "axios";
import{useEffect, useState} from 'react';

const Lock = () => {

  // const [email, getEmail] = useState('');
  const email = localStorage.getItem('email');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  localStorage.setItem('isLockedOut', true);

  const submit = async e => {
    e.preventDefault();
    const user = {
          email: email,
          password: password
         };
    // Create the POST request
    try {
        const {data} = await                                                                            
                      axios.post('http://127.0.0.1:8000/timeapp/api/login/', user ,{headers: {'Content-Type': 'application/json'}}, {withCredentials: true});
                      // axios.post('http://127.0.0.1:8000/timeapp/api/login/', user ,{headers: {'Content-Type': 'application/json'}}, {withCredentials: true});
 
  
        localStorage.setItem('access_token', data["tokens"]["access"]);
        localStorage.setItem('refresh_token', data["tokens"]["refresh"]);
        localStorage.setItem('fname', data["fname"]);
        localStorage.getItem('email');
        localStorage.setItem('isLogged', true);
        localStorage.setItem('isLockedOut', false);
      
        axios.defaults.headers.common['Authorization'] =`Bearer ${data['access']}`;
        window.location.href = '/Home/';

    } catch (error) {
       setErrorMessage("Incorrect Password ");
    }

       
 }   
  return (
    <div className='wrapper'>
        <form action="" onSubmit={submit}>
            <h1>Locked</h1>

            <h3>Re-enter password to continue</h3>

            <div className="input-box">
                  <input name="password" onChange={e => setPassword(e.target.value)} value={password} type="password" placeholder="Password" required />
                  <FaLock className='icon'/>
            </div>
            <div className="warning centerholder">{errorMessage}</div>
            <button type="submit" >Unlock</button>

        </form>    
    </div>
  )
}

export default Lock