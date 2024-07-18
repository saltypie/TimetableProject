import React, { useState, useEffect } from 'react';
import './Login.css';
import Navbar from './navigation.jsx';
import axios from "axios";
import Sidebar from './navigation/sidebar.jsx';
import { generalPost, searchFunction } from './reusable/functions.jsx';

const AddCourse = () => {
  
  const [courseName, setCourseName] = useState('');
  const [subjects, setSubjects] = useState([]);
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    try {
      const response = await searchFunction('viewsets/courses');
      setSubjects(response);
      console.log(`Hi ${response[0]["course_name"]}`);
    } catch (error) {
      console.error('Error fetching subjects:', error);
    }
  };

  const handleCourseNameChange = (e) => {
    setCourseName(e.target.value);
  };

  const handleSubjectsChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
    setSelectedSubjects(selectedOptions);
  };

  const submit = async (e) => {
    e.preventDefault();

    const body = {
      dept_name: courseName,
      courses: selectedSubjects
    };

    generalPost('viewsets/departments', body).then((response) =>{
      if (response.Message) {
        alert(response.Message);
        setErrorMessage(response.Message);
      } else {
        alert('Course/Department added successfully');
        // window.location.href = '/Department';
      }
    }).catch((error) => {
      console.error('There was an error!', error);
      setErrorMessage("Invalid Details");
    });
  };

  return (
    <div>
      <Navbar title="Home" isLoggedIn={localStorage.getItem('isLogged')} fname={localStorage.getItem('fname')} />
      <div className='wrapper'>
        <form onSubmit={submit}>
          <h1>Add Department</h1>

          <div className="input-box">
            <label htmlFor="courseName">Course Name:</label>
            <input 
              id="courseName"
              name="courseName"
              type="text" 
              placeholder="Enter Course Department Name" 
              value={courseName} 
              onChange={handleCourseNameChange} 
              required 
            />
          </div>

          <div className="input-box">
            <label htmlFor="subjects">Subjects/Courses:</label>
            <select
              id="subjects"
              multiple
              value={selectedSubjects}
              onChange={handleSubjectsChange}
              required
            >
              {subjects.map(subject => (
                <option key={subject.id} value={subject.id}>{subject.course_name}</option>
              ))}
            </select>
          </div>
              <br /><br />
          <button type="submit">Add</button>

          <div className="warning centerholder">
            {errorMessage && <p>{errorMessage}</p>}
          </div>
        </form>    
      </div>
    </div>
  );
}

export default AddCourse;
