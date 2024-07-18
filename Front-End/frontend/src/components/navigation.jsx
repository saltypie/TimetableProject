import React from 'react';
import { Link } from 'react-router-dom';
import './Login.css';

const Navbar = ({ title, isLoggedIn, fname }) => {
  const handleLogout = async () => {
    const confirmLogout = window.confirm("Are you sure you want to logout?");
    if (confirmLogout) {
      try {
        window.location.href = '/Logout';
      } catch (e) {
        console.log('Logout failed:', e);
      }
    }
  };

  const renderActions = () => {
    if (title === "Home") {
      let fname = localStorage.getItem("fname")
      console.log(fname)
      return (
        <div className="navbar-actions">
          {/* <span>{`Logged in as ${fname ? fname : "Admin"}`}</span> */}

          <Link to="/You">{`Logged in as ${fname ? fname : "Admin"}`}</Link>
          {/* <Link to="/Lock">Lock</Link> */}
          <Link to="/Lock" className="button">Lock</Link>
          <span className="button" onClick={handleLogout}>Logout</span>        </div>
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
      <div className="cursor-pointer navbar-title text-title-md1 font-semibold text-primary dark:text-white centerholder" onClick={() => window.location.href = '/'}>Timetabulous✨</div>
      {renderActions()}
    </nav>
  );
}

export default Navbar;
