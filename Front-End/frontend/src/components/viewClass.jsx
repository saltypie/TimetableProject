import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './navigation.jsx';
import Sidebar from './navigation/sidebar.jsx';
import EditClass from './editRoom.jsx';

const ViewClass = () => {
  const [classes, setClasses] = useState([]);
  
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/timeapp/api/classes/', { withCredentials: true });
      setClasses(response.data);
    } catch (error) {
      console.error('Error fetching classes:', error);
    }
  };

  return (
    <div>
      <Navbar title="Home" isLoggedIn={localStorage.getItem('isLogged')} fname={localStorage.getItem('fname')} />
      <AdminSidebar />
      <div className='wrapper'>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Capacity</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {classes.map((cls) => (
              <tr key={cls.id}>
                <td>{cls.id}</td>
                <td>{cls.name}</td>
                <td>{cls.capacity}</td>
                <td>
                  <EditClass classData={cls} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ViewClass;
