import React, { useState, useEffect } from 'react';
import './Login.css';
import Navbar from './navigation.jsx';
import axios from "axios";
import Sidebar from './navigation/sidebar.jsx';

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
      const response = await axios.get('http://127.0.0.1:8000/timeapp/api/viewsets/subjects', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_Token')}`
        }
      });
      setSubjects(response.data); // Assuming the response is an array of subject objects
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
      courseName: courseName,
      subjects: selectedSubjects
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
          <h1>Add Course</h1>

          <div className="input-box">
            <label htmlFor="courseName">Course Name:</label>
            <input 
              id="courseName"
              name="courseName"
              type="text" 
              placeholder="Enter Course Name" 
              value={courseName} 
              onChange={handleCourseNameChange} 
              required 
            />
          </div>

          <div className="input-box">
            <label htmlFor="subjects">Subjects:</label>
            <select
              id="subjects"
              multiple
              value={selectedSubjects}
              onChange={handleSubjectsChange}
              required
            >
              {subjects.map(subject => (
                <option key={subject.id} value={subject.id}>{subject.name}</option>
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

export default AddCourse;
