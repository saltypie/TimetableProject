import React from 'react';
import { Link } from 'react-router-dom';
import './Login.css';

const Navbar = ({ title, isLoggedIn, fname }) => {
  const renderActions = () => {
    if (title === "Home") {
      return (
        <div className="navbar-actions">
          <span>{`Logged in as ${fname}`}</span>
          <Link to="/Lock">Lock</Link>
          <Link to="/Logout">Logout</Link>
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

  return (
    <nav className="navbar">
      <div className="navbar-title">Timetable</div>
      {renderActions()}
    </nav>
  );
}

export default Navbar;
