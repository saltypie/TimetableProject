import React, { useState, useEffect } from 'react';
import './Login.css';
import Navbar from './navigation.jsx';
import axios from "axios";
import Sidebar from './navigation/sidebar.jsx';
import { generalPost, searchFunction } from './reusable/functions.jsx';

const AddSubject = () => {
  
  const [courseCode, setCourseCode] = useState('');
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
      const response = await searchFunction('/viewsets/institutionmembers');
      setLecturers(response); 
    } catch (error) {
      console.error('Error fetching lecturers:', error);
    }
  };
  const handleCourseCodeChange = (e) => {
    setCourseCode(e.target.value);
  }
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
      course_name: course,
      max_numb_students: courseCapacity,
      instructors: selectedLecturers
    };

    try {
      const { data } = await generalPost('viewsets/courses', body);

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
      
      <div className='wrapper'>
        <form onSubmit={submit}>
          <h1>Add Subject Unit</h1>

          <div className="input-box">
            <label htmlFor="course">Course Name:</label>
            <input 
              id="course_number"
              name="course_number"
              type="text" 
              placeholder="Enter Course Code/Number" 
              value={course} 
              onChange={handleCourseCodeChange} 
              required 
            />
            <span className="info" title="This is the code/number given to the course.">ℹ️</span>
          </div>

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
                <option key={lecturer.id} value={lecturer.id}>{`${lecturer.fname } ${lecturer.lname}`}</option>
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
