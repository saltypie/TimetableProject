import React, { useState } from 'react';
import './Login.css';
import Navbar from './navigation.jsx';
import axios from "axios";
import Sidebar from './navigation/sidebar.jsx';
import { generalPost } from './reusable/functions.jsx';

const AddTiming = () => {
  
  const [dayOfWeek, setDayOfWeek] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleDayOfWeekChange = (e) => {
    setDayOfWeek(e.target.value);
  }

  const handleStartTimeChange = (e) => {
    setStartTime(e.target.value);
    // Ensure endTime does not precede startTime
    if (endTime < e.target.value) {
      setEndTime(e.target.value); // Adjust endTime if it is before startTime
    } else {
      setErrorMessage("Start Time cannot be after End Time");
      // Check if endTime exceeds 3 hours from startTime
      // const maxEndTime = calculateMaxEndTime(e.target.value);
      // if (endTime > maxEndTime) {
      //   setEndTime(maxEndTime); // Adjust endTime if it exceeds max duration
      // }
    }
  }

  const handleEndTimeChange = (e) => {
    setEndTime(e.target.value);
    // Ensure endTime is not before startTime
    if (e.target.value < startTime) {
      setErrorMessage("End Time cannot be before Start Time");
    } else {
      setErrorMessage('');
    }
  }

  // const calculateMaxEndTime = (startTime) => {
  //   // Calculate max end time as 3 hours from startTime
  //   const maxDuration = 3 * 60 * 60 * 1000; // 3 hours in milliseconds
  //   const startTimestamp = new Date(`2000-01-01T${startTime}`).getTime(); // Assuming a dummy date for comparison
  //   const maxEndTime = new Date(startTimestamp + maxDuration).toISOString().substr(11, 5); // Format to HH:mm
  //   return maxEndTime;
  // }

  const submit = async (e) => {
    e.preventDefault();

    // Validation: Check if endTime is before startTime
    if (endTime < startTime) {
      setErrorMessage("End Time cannot be before Start Time");
      return;
    }

    // Validation: Check if endTime exceeds 3 hours from startTime
    // const maxEndTime = calculateMaxEndTime(startTime);
    // if (endTime > maxEndTime) {
    //   setErrorMessage(`End Time cannot exceed 3 hours from Start Time (${maxEndTime})`);
    //   return;
    // }
    
    const body = {
      time: `${startTime} - ${endTime}`,
      day: `${dayOfWeek}`,
    };

    generalPost('viewsets/meetingtimes/', body).then((data) => {
      if (!data) {
        alert(data.Message);
        setErrorMessage(data.Message);
      } else {
        // window.location.href = '/Timing';
        alert('Timing added successfully!');
      }
    }).catch((error) => {
      console.log(error);
    });
  }

  return (
    <div>
      <Navbar title="Home" isLoggedIn={localStorage.getItem('isLogged')} fname={localStorage.getItem('fname')} />
      
      <div className='wrapper'>
        <form onSubmit={submit}>
          <h1>Add Timing</h1>

          <div className="input-box">
            <label htmlFor="dayOfWeek">Day of the Week:</label>
            <select
              id="dayOfWeek"
              value={dayOfWeek}
              onChange={handleDayOfWeekChange}
              required
            >
              <option value="">Select a Day</option>
              <option value="Monday">Monday</option>
              <option value="Tuesday">Tuesday</option>
              <option value="Wednesday">Wednesday</option>
              <option value="Thursday">Thursday</option>
              <option value="Friday">Friday</option>
              <option value="Saturday">Saturday</option>
            </select>
          </div>

          <div className="input-box">
            <label htmlFor="startTime">Start Time:</label>
            <input 
              type="time" 
              id="startTime"
              placeholder="Start Time" 
              value={startTime} 
              onChange={handleStartTimeChange} 
              required 
            />
            <span className="info" title="Time the class should start">⏰</span>
          </div><br></br>

          <div className="input-box">
            <label htmlFor="endTime">End Time:</label>
            <input 
              type="time" 
              id="endTime"
              placeholder="End Time" 
              value={endTime} 
              onChange={handleEndTimeChange} 
              required 
            />
            <span className="info" title="Time the class should end">⏰</span>
          </div><br></br>

          <button type="submit">Add</button>

          <div className="warning centerholder">
            {errorMessage && <p>{errorMessage}</p>}
          </div>
        </form>    
      </div>
    </div>
  );
}

export default AddTiming;