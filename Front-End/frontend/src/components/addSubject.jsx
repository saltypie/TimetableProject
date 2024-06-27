import React, { useState, useEffect } from 'react';
import './Login.css';
import Navbar from './navigation.jsx';
import axios from "axios";
import Sidebar from './navigation/sidebar.jsx';

const AddSubject = () => {
  
  const [course, setCourse] = useState('');
  const [courseCapacity, setCourseCapacity] = useState('');
  const [lecturers, setLecturers] = useState([]);
  const [selectedLecturers, setSelectedLecturers] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    fetchLecturers();
  }, []);

  const fetchLecturers = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/timeapp/api/viewsets/lecturers', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_Token')}`
        }
      });
      setLecturers(response.data); // Assuming the response is an array of lecturer objects
    } catch (error) {
      console.error('Error fetching lecturers:', error);
    }
  };

  const handleCourseChange = (e) => {
    setCourse(e.target.value);
  };

  const handleCourseCapacityChange = (e) => {
    setCourseCapacity(e.target.value);
  };

  const handleLecturersChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
    setSelectedLecturers(selectedOptions);
  };

  const submit = async (e) => {
    e.preventDefault();

    const body = {
      course: course,
      capacity: courseCapacity,
      lecturers: selectedLecturers
    };

    try {
      const { data } = await axios.post(
        'http://127.0.0.1:8000/timeapp/api/viewsets/courses',
        body,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('access_Token')}`
          }
        }
      );

      if (data.Message) {
        alert(data.Message);
        setErrorMessage(data.Message);
      } else {
        window.location.href = '/room/';
      }
    } catch (error) {
      setErrorMessage("Invalid Details");
    }
  };

  return (
    <div>
      <Navbar title="Home" isLoggedIn={localStorage.getItem('isLogged')} fname={localStorage.getItem('fname')} />
      <AdminSidebar />
      <div className='wrapper'>
        <form onSubmit={submit}>
          <h1>Add Subject Unit</h1>

          <div className="input-box">
            <label htmlFor="course">Course Name:</label>
            <input 
              id="course"
              name="course"
              type="text" 
              placeholder="Enter Course Name" 
              value={course} 
              onChange={handleCourseChange} 
              required 
            />
            <span className="info" title="This is the name given to the course.">ℹ️</span>
          </div>

          <div className="input-box">
            <label htmlFor="capacity">Capacity:</label>
            <input 
              id="capacity"
              name="capacity"
              type="number" 
              placeholder="Enter Course Capacity" 
              value={courseCapacity} 
              onChange={handleCourseCapacityChange} 
              required 
            />
          </div>

          <div className="input-box">
            <label htmlFor="lecturers">Lecturers:</label>
            <select
              id="lecturers"
              multiple
              value={selectedLecturers}
              onChange={handleLecturersChange}
              required
            >
              {lecturers.map(lecturer => (
                <option key={lecturer.id} value={lecturer.id}>{lecturer.name}</option>
              ))}
            </select>
          </div>

          <button type="submit">Add</button>

          <div className="warning centerholder">
            {errorMessage && <p>{errorMessage}</p>}
          </div>
        </form>    
      </div>
    </div>
  );
}

export default AddSubject;
