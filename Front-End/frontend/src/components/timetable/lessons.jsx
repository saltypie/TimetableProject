import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { searchFunction } from '../reusable/functions';
import Navbar from '../navigation';
import VoteComponent from './votes';
import CommentComponent from './comments';

const Timetable = () => {
  const [schedules, setSchedules] = useState({});
  const { timetableId } = useParams();

  useEffect(() => {
    const fetchTimetable = async () => {
      try {
        const response = await searchFunction(`/viewsets/lessondetails/table/?search=${timetableId}/`);
        setSchedules(response);
      } catch (error) {
        console.error('Error fetching timetable:', error);
      }
    };

    fetchTimetable();
  }, [timetableId]);

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const times = ['08:15 - 10:15', '10:15 - 12:15', '12:15 - 14:15', '14:15 - 16:15'];

  const renderLesson = (lesson) => {
    if (lesson === 'No Lesson') {
      return <p className="text-xs text-gray-500">No Lesson</p>;
    }
    return (
      <div>
        <p className="font-bold">{lesson.course}</p>
        <p className="text-sm">{lesson.instructor}</p>
        <p className="text-xs text-gray-500">Room: {lesson.room}</p>
      </div>
    );
  };

  const renderTimetable = (streamName, streamData) => (
    <div key={streamName} className="mb-8">
      <h2 className="text-xl font-bold mb-2">{streamName}</h2>
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-4 py-2 border">Day / Time</th>
            {times.map(time => (
              <th key={time} className="px-4 py-2 border">{time}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {days.map(day => (
            <tr key={day}>
              <th className="px-4 py-2 border bg-gray-100">{day}</th>
              {times.map(time => (
                <td key={`${day}-${time}`} className="px-4 py-2 border">
                  {renderLesson(streamData[day]?.[time] || 'No Lesson')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <><Navbar title="Home"/>
      <div className="overflow-x-auto p-4">
        <br /><br />
        {Object.entries(schedules).map(([streamName, streamData]) => 
          renderTimetable(streamName, streamData)
        )}
        <VoteComponent scheduleId={timetableId}></VoteComponent>
        <CommentComponent scheduleId={timetableId}></CommentComponent>

      </div>
    </>
  );
};

export default Timetable;