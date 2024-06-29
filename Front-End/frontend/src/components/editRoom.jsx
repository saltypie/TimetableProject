import React, { useState } from 'react';
import axios from 'axios';
import './Login.css';
import Navbar from './navigation.jsx';

import Sidebar from './navigation/sidebar.jsx';
const EditRoom = ({ classData }) => {
  const [editedClass, setEditedClass] = useState(classData);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedClass({ ...editedClass, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://127.0.0.1:8000/timeapp/api/classes/${editedClass.id}/`, editedClass, { withCredentials: true });
      alert('Class updated successfully!');
    } catch (error) {
      console.error('Error updating class:', error);
      alert('Failed to update class. Please try again later.');
    }
  };

  return (
    <div>
    <Navbar title="Home" isLoggedIn={localStorage.getItem('isLogged')} fname={localStorage.getItem('fname')} />
      
      <AdminSidebar />
    <form onSubmit={handleSubmit}>
      <input type="text" name="name" value={editedClass.name} onChange={handleInputChange} required />
      <input type="number" name="capacity" value={editedClass.capacity} onChange={handleInputChange} required />
      <button type="submit">Save</button>
    </form>
    </div>
  );
};

export default EditRoom;
