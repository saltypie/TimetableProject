import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Login.css';
import { FaLock } from "react-icons/fa";
import Navbar from './navigation.jsx';
import axios from "axios";
import HomeTiles from './reusable/homeoptions.jsx';
import Sidebar from './navigation/sidebar.jsx';

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
      // timeoutId = setTimeout(handleInactivity, 20000); // 20 seconds
      timeoutId = setTimeout(handleInactivity, 200000000); // 20 seconds
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
      {/* <Sidebar/> */}
      <div className=''>
        <div className='rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1'>
          <h1 className='centerholder'>Welcome</h1>
          <HomeTiles is_institution_approved={localStorage.getItem('is_institution_approved')} is_application_accepted={localStorage.getItem('is_application_accepted')} role={localStorage.getItem('role')} institution={localStorage.getItem('institution')}/>
          <br />
        </div>
      </div>
    </div>
  );
}

export default Home;
