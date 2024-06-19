import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Login.css';
import { FaLock } from "react-icons/fa";
import Navbar from './navigation.jsx';
import axios from "axios";

const Home = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  if(!localStorage.getItem('isLogged')){
    window.location.href = '/login';
  }
  if(localStorage.getItem('isLockedOut')=="true"){
    window.location.href = '/Lock';
  }
  const checkRefresh = async() => {
    try {
      const {data} = await                                                                            
                     axios.post('http://127.0.0.1:8000/timeapp/api/login/refresh/', {refresh:localStorage.getItem('refresh_token')} ,{headers: {'Content-Type': 'application/json'}}, {withCredentials: true});

      localStorage.setItem('access_token', data["access"]);
      localStorage.setItem('refresh_token', data["refresh"]);
      console.log(localStorage.getItem('refresh_token'));
   } catch (error) {
      window.location.href='/logout';
   }
  }
  setInterval(checkRefresh, 20*1000);
  useEffect(() => {
    let timeoutId;

    const handleInactivity = () => {
      // localStorage,set(IsLogged, false);
      localStorage.setItem('isLockedOut', true);
      window.location.href = '/Lock'; // Redirect to Lock component
    };

    const resetTimer = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(handleInactivity, 20000); // 20 seconds
    };

    const events = ['click', 'keydown', 'mousemove', 'wheel'];

    const addEventListeners = () => {
      events.forEach(event => {
        window.addEventListener(event, resetTimer);
      });
    };

    const removeEventListeners = () => {
      events.forEach(event => {
        window.removeEventListener(event, resetTimer);
      });
    };

    addEventListeners(); // Add event listeners when component mounts

    resetTimer(); // Start the timer initially

    return () => {
      removeEventListeners(); // Remove event listeners when component unmounts
      clearTimeout(timeoutId); // Clear the timeout
    };
  }, []);

  return (
    <div>
      <Navbar title="Home" isLoggedIn={localStorage.getItem('isLogged')} fname={localStorage.getItem('fname')} />
      <div className='wrapper'>
        <h1>Welcome</h1>
      </div>
    </div>
  );
}

export default Home;
