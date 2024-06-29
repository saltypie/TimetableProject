import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Timetable = () => {
  const [timetables, setTimetables] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8000/api/viewsets/timetables/')
      .then(response => {
        setTimetables(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the timetable data!', error);
      });
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Timetables</h1>
      <div className="grid grid-cols-1 gap-4">
        {timetables.map((timetable) => (
          <div key={timetable.id} className="bg-white shadow-md rounded p-4">
            <p><strong>ID:</strong> {timetable.id}</p>
            <p><strong>Time Made:</strong> {new Date(timetable.time_made).toLocaleString()}</p>
            <p><strong>Author:</strong> {timetable.author}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Timetable;
