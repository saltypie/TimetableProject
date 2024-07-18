import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaPlus, FaTrash } from 'react-icons/fa';
import { searchFunction,makeNotification, generalDelete } from '../reusable/functions';
import Navbar from '../navigation';
import { Link } from 'react-router-dom';


const Timetables = () => {
  const [timetables, setTimetables] = useState([]);
  const [status, setStatus] = useState('');
  const [timesets, setTimesets] = useState([]);
  const [selectedTimeset, setSelectedTimeset] = useState()

  useEffect(() => {
    fetchTimetables();
    fetchTimesets();
  }, []);


  const fetchTimetables = () =>{
    searchFunction('/viewsets/timetables/')
      .then(response => {
        setTimetables(response);
        console.log(response)
      })
      .catch(error => {
        console.error('There was an error fetching the timetable data!', error);
      });
  }
  const fetchTimesets = async () => {
    try {
      const data = await searchFunction('viewsets/timesets/')
      setTimesets(data)
    } catch (error) {
      console.log("Error fetching timesets")
    }
  }
  const handleTimesetChange = (e) =>{
    setSelectedTimeset(e.target.value)
  }
  const handleNewScheduleClick = () => {
    setStatus('generating...');
    console.log(selectedTimeset)
    searchFunction('/make_table/',{timeset:selectedTimeset})
    .then(response => {
        if(response==="Error-AxiosError: Request failed with status code 500"){
          setStatus('Impossible constraints provided.');
        }else if(response["Error"]){
          setStatus(response["Error"]);
        }else{
          makeNotification(`New schedule has been made by the scheduler on ${new Date().toLocaleString()}`).then(() => {
            
          }).catch(error => {
            console.error('There was an error while notifying', error);
          });
          setStatus('success');
        }

    })
    .catch(error => {
        console.error('There was an error generating the timetable!', error);
        setStatus('error generating timetable');
    });
    
  };

  const handleTimetableDelete = async (id) => {
    await generalDelete('/viewsets/timetables/', id);
    fetchTimetables();
  }

  return (
    
    <div className="container mx-auto p-4"><Navbar title="Home"/>
      <div className="bg-white shadow-md rounded p-4 centerholder">
        <div>
          <div className="centerholder mb-2">
            <button onClick={handleNewScheduleClick}className="flex items-center justify-center rounded-md bg-primary p-2 text-white hover:bg-opacity-95">
                <FaPlus className='inline'></FaPlus> Generate New Schedule Set
            </button>
          </div>
        
          <div className="input-box">
            <label htmlFor="timesets">Choose a Timeset:</label>
            <select
              id="timesets"
              value={selectedTimeset}
              onChange={handleTimesetChange}
              required
            >
              <option>Select A Timeset</option>
              {timesets.map(timeset => (
                <option key={timeset.id} value={timeset.id}>{timeset.name}</option>
              ))}
            </select>
          </div>


          { status !=='' && <><br/><p>{status}</p></>}
        </div>
        <br/>     
      </div>
      <h1 className="text-2xl font-bold mb-4 centerholder">Timetables</h1>
      <div className="grid grid-cols-1 gap-4">
        {timetables.map((timetable) => (
          <div className="bg-white shadow-md rounded p-4">
                <Link key={timetable.id} to={`/lessons/${timetable.id}/${timetable.timeset}`}>
                  <p><strong>ID:</strong> {timetable.id}</p>
                  <p><strong>Time Made:</strong> {new Date(timetable.time_made).toLocaleString()}</p>
                  <p><strong>Author:</strong> {timetable.author.fname} {timetable.author.lname}</p>
                </Link>
                <FaTrash onClick={() =>{handleTimetableDelete(timetable.id)}}></FaTrash>
            </div>
        ))}
      </div>
    </div>
  );
}

export default Timetables;
