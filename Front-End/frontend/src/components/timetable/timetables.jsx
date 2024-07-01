import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaPlus } from 'react-icons/fa';
import { searchFunction } from '../reusable/functions';
import Navbar from '../navigation';
import { Link } from 'react-router-dom';


const Timetables = () => {
  const [timetables, setTimetables] = useState([]);
  const [status, setStatus] = useState('');
  useEffect(() => {
    searchFunction('/viewsets/timetables/')
      .then(response => {
        setTimetables(response);
        console.log(response)
      })
      .catch(error => {
        console.error('There was an error fetching the timetable data!', error);
      });
  }, []);


  const handleNewScheduleClick = () => {
    setStatus('generating...');
    searchFunction('/make_table/')
    .then(response => {
        if(response==="Error-AxiosError: Request failed with status code 500"){
          setStatus('Impossible constraints provided.');
        }else{
          setStatus('success');
        }

    })
    .catch(error => {
        console.error('There was an error generating the timetable!', error);
        setStatus('error generating timetable');
    });
  };
  return (
    
    <div className="container mx-auto p-4"><Navbar title="Home"/>
      <div className="bg-white shadow-md rounded p-4 centerholder">
        <div>
          <button onClick={handleNewScheduleClick}class="flex items-center justify-center rounded-md bg-primary p-2 text-white hover:bg-opacity-95">
              <FaPlus className='inline'></FaPlus> Generate New Schedule Set
          </button>
          { status !=='' && <><br/><p>{status}</p></>}
        </div>
        <br/>
      </div>
      <h1 className="text-2xl font-bold mb-4">Timetables</h1>
      <div className="grid grid-cols-1 gap-4">
        {timetables.map((timetable) => (
          <Link key={timetable.id} to={`/lessons/${timetable.id}`}>
            <div className="bg-white shadow-md rounded p-4">
                <p><strong>ID:</strong> {timetable.id}</p>
                <p><strong>Time Made:</strong> {new Date(timetable.time_made).toLocaleString()}</p>
                <p><strong>Author:</strong> {timetable.author.fname} {timetable.author.lname}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Timetables;
