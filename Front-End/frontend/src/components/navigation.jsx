import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Navbar = ({ title }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [fname, setFname] = useState('');
  const [role, setRole] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('/api/user/profile');
        if (response.ok) {
          const userData = await response.json();
          setProfilePhoto(userData.profilePhoto || '../images/user/default.png'); 
          setFname(userData.fname );
          setRole(userData.role ); 
        } else {
          console.error('Failed to fetch user data');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

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

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const renderActions = () => {
    if (title === "Home") {
      let roleText = '';
      if (role === 'admin') {
        roleText = 'Admin';
      } else if (role === 'instructor') {
        roleText = 'Instructor';
      } else if (role === 'scheduler') {
        roleText = 'Scheduler';
      } else {
        roleText = 'Role not specified';
      }

      return (
        <div className="navbar-actions flex items-center">
          <div className="relative">
            {/* Profile photo */}
            <button
              className="focus:outline-none"
              onClick={toggleDropdown}
            >
              <img
                src={profilePhoto}
                alt="Profile"
                className="h-10 w-10 rounded-full cursor-pointer"
              />
            </button>
            {/* Dropdown content */}
            <div className={`dropdown-content absolute ${isDropdownOpen ? 'block' : 'hidden'} bg-white shadow-lg rounded mt-2 py-2 w-40 z-10 right-0`}>
              <div className="flex items-center px-4 py-2">
                <span className="text-black">{fname}</span>
              </div>
              <hr className="my-2" />
              <Link
                to="/Lock"
                className="block w-full text-left px-4 py-2 text-black hover:bg-gray-200"
              >
                Lock
              </Link>
              <Link
                to="/You"
                className="block w-full text-left px-4 py-2 text-black hover:bg-gray-200"
              >
                Profile
              </Link>
              <hr className="my-2" />
              <span
                className="block px-4 py-2 text-black hover:bg-gray-200 cursor-pointer"
                onClick={handleLogout}
              >
                Logout
              </span>
            </div>
          </div>
        </div>
      );
    } else if (title === "Landing Page") {
      return (
        <div className="navbar-actions">
          <div className="dropdown">
            <button className="dropbtn">Get Started</button>
            <div className="dropdown-content">
              <Link to="/signup" className="text-black">Signup</Link>
              <Link to="/login" className="text-black">Login</Link>
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

  // Dynamically change the navbar title based on role
  let navbarTitle = 'Timetable';
  if (role === 'admin') {
    navbarTitle = 'Timetable (Admin)';
  } else if (role === 'instructor') {
    navbarTitle = 'Timetable (Instructor)';
  } else if (role === 'scheduler') {
    navbarTitle = 'Timetable (Scheduler)';
  }

  return (
    <nav className="navbar bg-gray-800 text-white py-4">
      <div className="navbar-title text-xl font-bold">{navbarTitle}</div>
      {renderActions()}
    </nav>
  );
}

export default Navbar;
