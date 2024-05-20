import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Login.css';
import { FaLock } from "react-icons/fa";
import Navbar from './navigation.jsx';

const Home = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  useEffect(() => {
    let timeoutId;

    const handleInactivity = () => {
      setIsLoggedIn(false);
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
      <Navbar title="Home" isLoggedIn={isLoggedIn} />
      <div className='wrapper'>
        <h1>Welcome</h1>
      </div>
    </div>
  );
}

export default Home;
