import React, { useState, useEffect } from 'react';
import './Login.css';
import Navbar from './navigation.jsx';
import axios from "axios";
import Sidebar from './navigation/sidebar.jsx';
import { generalPost, searchFunction } from './reusable/functions.jsx';

const AddSection = () => {
  const [departments, setDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [classesPerWeek, setClassesPerWeek] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const response = await searchFunction('viewsets/departments');
      console.log(response)
      setDepartments(response); // Assuming the response is an array of department objects
    } catch (error) {
      console.error('Error fetching departments:', error);
    }
  };

  const handleDepartmentChange = (e) => {
    setSelectedDepartment(e.target.value);
  };

  const handleClassesPerWeekChange = (e) => {
    setClassesPerWeek(e.target.value);
  };

  const submit = async (e) => {
    e.preventDefault();

    const body = {
      department: selectedDepartment,
      lessons_per_week: classesPerWeek
    };


    generalPost('viewsets/streams', body).then((response) =>{
      if (response.Message) {
        alert(response.Message);
        setErrorMessage(response.Message);
      } else {
        window.location.href = '/Stream';
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
          <h1>Add Section</h1>

          <div className="input-box">
            <label htmlFor="department">Department:</label>
            <select
              id="department"
              value={selectedDepartment}
              onChange={handleDepartmentChange}
              required
            >
              <option value="">Select Department</option>
              {departments.map(department => (
                <option key={department.id} value={department.id}>{department.dept_name}</option>
              ))}
            </select>
          </div>

          <div className="input-box">
            <label htmlFor="classesPerWeek">Classes Per Week:</label>
            <input
              type="number"
              id="classesPerWeek"
              placeholder="Classes Per Week"
              value={classesPerWeek}
              onChange={handleClassesPerWeekChange}
              required
            />
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

export default AddSection;
