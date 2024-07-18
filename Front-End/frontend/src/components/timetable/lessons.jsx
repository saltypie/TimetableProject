import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { searchFunction } from '../reusable/functions';
import Navbar from '../navigation';
import VoteComponent from './votes';
import CommentComponent from './comments';
import { EditLessonModal } from '../reusable/modals';

const Timetable = () => {
  const [showEditModal, setShowEditModal] = useState(false);
  const [editLesson, setEditLesson] = useState(null);
  const [newTiming, setNewTiming] = useState(null);

  const [schedules, setSchedules] = useState({});
  const { timetableId,timeset} = useParams();
  const [errorMessage, setErrorMessage] = useState('');
  useEffect(() => {
    // const fetchTimetable = async () => {
    //   try {

    //     const response = await searchFunction(`/viewsets/lessondetails/table/?search=${timetableId}/`);
    //     setSchedules(response);
    //   } catch (error) {
    //     console.error('Error fetching timetable:', error);
    //   }
    // };

    fetchTimetable();
    fetchDaysAndTimes();
  }, [timetableId,timeset]);

  // const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  // const times = ['08:15 - 10:15', '10:15 - 12:15', '12:15 - 14:15', '14:15 - 16:15'];
  const [slots,setSlots] = useState();

  const fetchTimetable = async () => {
    try {

      const response = await searchFunction(`/viewsets/lessondetails/table/?search=${timetableId}/`);
      setSchedules(response);
    } catch (error) {
      console.error('Error fetching timetable:', error);
    }
  };
  
  // searchFunction('viewsets/meetingtimes').then()
  const renderLesson = (lesson) => {
    if (lesson === 'No Lesson') {
      return <p className="text-xs text-gray-500">No Lesson</p>;
    }
    if (localStorage.getItem('role')==="scheduler") {
      return (
        <div onClick={()=>{setShowEditModal(true); setEditLesson(lesson)}}>
          <p className="font-bold">{lesson.course}</p>
          <p className="text-sm">{lesson.instructor}</p>
          <p className="text-xs text-gray-500">Room: {lesson.room}</p>
        </div>
      );      
    }

    return (
      <div>
        <p className="font-bold">{lesson.course}</p>
        <p className="text-sm">{lesson.instructor}</p>
        <p className="text-xs text-gray-500">Room: {lesson.room}</p>
      </div>
    );
  };

  const fetchDaysAndTimes = async() =>{
    if (timeset == "null") {
      setErrorMessage("Timeset no longer exists, timetable now invalid")
      return ;
    }
    try {
      const the_slots=await searchFunction('/viewsets/meetingtimes/getslots', {timeset:timeset})
      setSlots(the_slots)
    } catch (error) {
     console.log(`Error obtaining days and/or time: ${error}`) 
    }
  }

  const renderTimetable = (streamName, streamData) => (
    <div key={streamName} className="mb-8 mt-8">
      <h2 className="text-xl font-bold mb-2">{streamName}</h2>
      <div className="overflow-x-auto" style={{ width: '90vw', maxWidth: '100vw' }}>
        <table className="w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 border">Day / Time</th>
              {slots.times.map(time => (
                <th key={time} className="px-4 py-2 border">{time}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {slots.days.map(day => (
              <tr key={day}>
                <th className="px-4 py-2 border bg-gray-100">{day}</th>
                {slots.times.map(time => (
                  <td key={`${day}-${time}`} className="px-4 py-2 border">
                    {renderLesson(streamData[day]?.[time] || 'No Lesson')}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <><Navbar title="Home"/>
      <EditLessonModal show={showEditModal} onClose={() => {setShowEditModal(false); fetchTimetable()}} lesson={editLesson}/>
      <div className="p-4">
        <br /><br />
        {errorMessage && <i>{errorMessage}</i>}
        {slots?(Object.entries(schedules).map(([streamName, streamData]) => 
          renderTimetable(streamName, streamData)
        )):(
          <p>Loading...</p>
        )}
        <VoteComponent scheduleId={timetableId}></VoteComponent>
        <CommentComponent scheduleId={timetableId}></CommentComponent>

      </div>
    </>
  );
};

export default Timetable;