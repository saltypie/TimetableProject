import React, { useState } from 'react';
import { Link, Redirect } from 'react-router-dom';
import './Login.css';

const Navbar = ({ title, isLoggedIn, userName }) => {
  const renderActions = () => {
    if (title === "Home") {
      return (
        <div className="navbar-actions">
          <span>{`Logged in as ${fname}`}</span>
          <Link to="/Lock">Lock</Link>
          <button onClick={handleLogout}>Logout</button>
        </div>
      );
    } else if (title === "Landing Page") {
      return (
        <div className="navbar-actions">
          <div className="dropdown">
            <button className="dropbtn">Get Started</button>
            <div className="dropdown-content">
              <Link to="/signup">Signup</Link>
              <Link to="/login">Login</Link>
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div className="navbar-actions">
          <Link to="/LandingPage" className="back-button">Back</Link>
        </div>
      );
    }
  };

  if (logoutConfirmed) {
    return <Link to="/Logout" />;
  }

  return (
    <nav className="navbar">
      <div className="navbar-title">Timetable</div>
      {renderActions()}
    </nav>
  );
}

export default Navbar;
