import React from 'react';
import './index.css';
import Navbar from './navigation.jsx';
import Sidebar from './navigation/sidebar.jsx'; 
function Admin() {
  return (
    <div>
      <Navbar title="Home" isLoggedIn={localStorage.getItem('isLogged')} fname={localStorage.getItem('fname')} />
      
        <AdminSidebar /> {}
        <div className='wrapper'>
        <div className='content'>
          <h1>Welcome</h1>
        </div>
      </div>
    </div>
  );
}

export default Admin;
