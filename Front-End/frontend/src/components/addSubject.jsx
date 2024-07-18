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
      console.log('Fetched lecturers:', response); // Log the fetched lecturers
      setLecturers(response);
    } catch (error) {
      console.error('Error fetching lecturers:', error);
    }
  };

  const handleCourseCodeChange = (e) => {
    setCourseCode(e.target.value);
  };

  const handleCourseChange = (e) => {
    setCourse(e.target.value);
  };

  const handleCourseCapacityChange = (e) => {
    setCourseCapacity(e.target.value);
  };

  const handleLecturersChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
    console.log('Selected options:', selectedOptions); // Log selected options
    setSelectedLecturers(selectedOptions);
  };

  const submit = async (e) => {
    e.preventDefault();

    const body = {
      course_number: courseCode,
      course_name: course,
      max_numb_students: courseCapacity,
      instructors: selectedLecturers
    };

    generalPost('viewsets/courses', body).then((response) => {
      // if (response.Message) {
      if (!response) {
        // alert(response.Message);
        setErrorMessage("Course/Unit with the same code and/or name already exists");
      } else {
        console.log(response);
        alert('Course Subject added successfully');
        // window.location.href = '/Course';
      }
    }).catch((error) => {
      console.error('There was an error!', error);
      setErrorMessage("Invalid Details");
    });
  };

  return (
    <div>
      <Navbar title="Home" isLoggedIn={localStorage.getItem('isLogged')} fname={localStorage.getItem('fname')} />
      
      <div className='rounded-sm border border-stroke bg-white py-6 px-7.5 shadow-default dark:border-strokedark dark:bg-boxdark'>
        <form onSubmit={submit}>
          <h1 className='text-title-md2 font-semibold text-primary dark:text-white centerholder'>Add Subject Unit</h1>

          <div className="input-box">
            <label htmlFor="course_number">Course Code:</label>
            <div className="centerholder">
              <input 
                id="course_number"
                name="course_number"
                type="text" 
                placeholder="Enter Course Code/Number" 
                value={courseCode} 
                onChange={handleCourseCodeChange} 
                required 
              />
              <span className="info inline" title="This is the code/number given to the course.">ℹ️</span>
            </div>
          </div>
          <div className="mb-1"></div>
          <div className="input-box">
            <label htmlFor="course">Course Name:</label>
            <div className="centerholder">
              <input 
                id="course"
                name="course"
                type="text" 
                placeholder="Enter Course Name" 
                value={course} 
                onChange={handleCourseChange} 
                required 
              />
              <span className="info inline" title="This is the name given to the course.">ℹ️</span>
            </div>
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
                
                <option key={lecturer.id} value={lecturer.id}>{`${lecturer.fname} ${lecturer.lname}`}</option>
              ))}
            </select>
          </div>
          <div className="centerholder">
            <button className="justify-center inline-flex items-center justify-center bg-primary py-4 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10" type="submit">Add</button>
          </div>

          <div className="warning centerholder">
            {errorMessage && <p>{errorMessage}</p>}
          </div>
        </form>    
      </div>
    </div>
  );
};

export default AddSubject;
