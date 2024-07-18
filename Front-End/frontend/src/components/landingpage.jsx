import React from 'react';
import './Login.css';
import { Link } from 'react-router-dom';


import Navbar from './navigation.jsx';

const LandingPage = () => {
  return (
    <div><Navbar title="Landing Page" />
    <div className='wrapper'>
      <h1>Welcome to Timetabulous</h1>
          
    </div></div>
  )
}

export default LandingPage
