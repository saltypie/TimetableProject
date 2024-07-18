import React, { useState } from 'react';
import './Login.css';
import Navbar from './navigation.jsx';
import Sidebar from './navigation/sidebar.jsx';
import { generalPost } from './reusable/functions.jsx';

const AddTiming = () => {
  const [duration, setDuration] = useState();
  const [errorMessage, setErrorMessage] = useState('');
  const [name, setName] = useState('')
  const [startTime, setStartTime] = useState();
  const [endTime, setEndTime] = useState();
  const [startDayNum, setStartDayNum] = useState(null);
  const [endDayNum, setEndDayNum] = useState(null);

  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];





  const handleNameChange = (e)=>{
    setName(e.target.value);
  } 
  const handleDurationChange = (e)=>{
    setDuration(e.target.value);
  } 

  const submit = async (e) => {
    e.preventDefault();

    console.log("abc")
    console.log(typeof startDayNum)
    console.log(typeof endDayNum)
    if (endTime <= startTime) {
      setErrorMessage(`End Time cannot be before or at Start Time`);
      return;
    }
    if (endDayNum < startDayNum) {
      setErrorMessage(`End Day cannot be before Start Day`);
      return;
    }
    if (startDayNum == null){
      setErrorMessage("Pick a start day")
      return;
    }
    if (endDayNum == null){
      setErrorMessage("Pick an end day")
      return;
    }
   
    const body = {
      name:name,
      duration :duration,
      start_day_num: startDayNum,
      end_day_num: endDayNum,
      start_time: startTime,
      end_time: endTime

    };

    try {
      const data = await generalPost('viewsets/timesets', body);
      if (!data) {
        setErrorMessage(`Timeset already exists`);
      } else {
        alert(`Timeset added successfully!`);
      }
    } catch (error) {
      console.log(error);
    }

  }

  return (
    <div>
      <Navbar title="Home" isLoggedIn={localStorage.getItem('isLogged')} fname={localStorage.getItem('fname')} />

      <div className='mt-9 rounded-sm border border-stroke bg-white py-6 px-10 shadow-default dark:border-strokedark dark:bg-boxdark'>
        <form onSubmit={submit}>
          <h1 className='text-title-md2 font-semibold text-primary dark:text-white centerholder'>Add Timeset</h1>
          <br />

          <div className="centerholder input-box mb-2">
            <input 
              id="name"
              type="text" 
              name="name"
              placeholder="Timeset Name" 
              value={name} 
              onChange={handleNameChange} 
              required             />
          </div>
          <div className="centerholder input-box mb-2">
            <input 
              id="duration"
              type="number" 
              name="duration"
              placeholder="Lesson Duration (minutes)" 
              value={duration} 
              onChange={handleDurationChange} 
              required             />
          </div>

          <label htmlFor={`startTime`}>Start Time:</label>
          <div className="input-box centerholder mb-2">          
            <input
              type="time"
              id={`startTime`}
              placeholder="Starting Time of a work day"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              required
            />
          </div>

          <label htmlFor={`endTime`}>End Time:</label>

          <div className="input-box centerholder mb-2">          
            <input
              type="time"
              id={`endTime`}
              placeholder="Ending Time of a work day"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              required
            />
          </div>

          <div className="input-box centerholder mb-2">          
            <select 
              id='startDayNum'
              onChange={(e) => setStartDayNum(Number(e.target.value))}
              required
            >
              <option value={null}>Choose a Day</option>
              {
                daysOfWeek.map((day,i) => (
                  <option key={i} value={i}>{day}</option>
                ))
              }
              <option></option>
            </select>
          </div>

          <div className="input-box centerholder mb-2">
            <select 
              id='endDayNum'
              onChange={(e) => setEndDayNum(Number(e.target.value))}
              required
              >
                <option value={null}>Choose a Day</option>
              {
                daysOfWeek.map((day,i) => (
                  <option key={i} value={i}>{day}</option>
                ))
              }
              <option></option>
            </select>
          </div>


          <div className="centerholder">
            <button type="submit" className='justify-center inline-flex items-center justify-center bg-primary py-4 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10" type="submit">Add</button>'>Add</button>
          </div>

          <div className="warning centerholder">
            {errorMessage && <p>{errorMessage}</p>}
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddTiming;
