import React, { useState, useEffect } from 'react';
import './Login.css';
import Navbar from './navigation.jsx';
import axios from "axios";
import Sidebar from './navigation/sidebar.jsx';
import { generalPost } from './reusable/functions.jsx';

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
      const response = await axios.get('http://127.0.0.1:8000/timeapp/api/viewsets/departments', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_Token')}`
        }
      });
      setDepartments(response.data); // Assuming the response is an array of department objects
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
      classesPerWeek: classesPerWeek
    };

    try {
      const { data } = await generalPost('viewsets/streams', body);

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
                <option key={department.id} value={department.id}>{department.name}</option>
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
