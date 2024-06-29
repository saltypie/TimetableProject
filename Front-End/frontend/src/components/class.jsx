import React, { useState, useEffect } from 'react';
import './index.css';
import { Link } from 'react-router-dom'; 
import Navbar from './navigation.jsx';
import Sidebar from './navigation/sidebar.jsx';
import axios from 'axios';

function Class() {
  const [classCount, setClassCount] = useState(0);

  useEffect(() => {
    fetchClassCount();
  }, []);

  const fetchClassCount = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/timeapp/api/classes/count', { withCredentials: true });
      setClassCount(response.data.count);
    } catch (error) {
      console.error('Error fetching class count:', error);
    }
  };

  return (
    <div>
      <Navbar title="Home" isLoggedIn={localStorage.getItem('isLogged')} fname={localStorage.getItem('fname')} />
      <AdminSidebar />
      <div className='content'>
        <div className="card-container">
         
          <div className="card">
            <h2>Number of Classes</h2>
            <p>{classCount}</p>
          </div>
          <div className="card">
            <h2>View Classes</h2>
            <Link to="/viewClass">
              <button>View</button>
            </Link>
          </div>
         
          <div className="card">
            <h2>Add Class</h2>
            <Link to="/addClass"> {}
              <button>Add</button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Class;
