// timingTable.js

import React, { useEffect, useState } from 'react';
import '../Login.css';
import axios from 'axios';
import Navbar from '../navigation';
import {searchFunction,generalPatch, generalDelete} from '../reusable/functions';
import { DeleteModal } from '../reusable/modals';

const TimingTable = () => {
    const [timeset, setTimeSet] = useState();
    const [timesets, setTimesets] = useState([])
    const [timings, setTimings] = useState([]);
    const [editTimingId, setEditTimingId] = useState(null);
   
    const [showDeleteModal1, setShowDeleteModal1] = useState(false);
    const [deleteTimingId,setDeleteTimingId] = useState(null);
    const [deleteTimingName,setDeleteTimingName] = useState(null);
    
    const [showDeleteModal2, setShowDeleteModal2] = useState(false);
    const [deleteTimesetId,setDeleteTimesetId] = useState(null);
    const [deleteTimesetName,setDeleteTimesetName] = useState(null);

    const [editFormData, setEditFormData] = useState({
        day: '',
        time: ''
    });
    // const [displayMessage,setDisplayMessage] = useState('')
    const fetchMeetingTimes = async () => {
        try {
            // const data = timeset?await searchFunction('viewsets/meetingtimes/', { timeset: timeset.id}):setDisplayMessage("Choose A Timeset");
            const data = timeset && await searchFunction('viewsets/meetingtimes/', { timeset: timeset.id});
            console.log("mts")
            console.log(data)
            console.log(timings)
            setTimings(data);
        } catch (error) {
            console.log(error);
        }
    };

    const fetchTimesets = async () =>{
        try {
            const data = await searchFunction('viewsets/timesets/')
            setTimesets(data)
          } catch (error) {
            console.log(`Error fetching timesets --- ${error}`)
          }
    }

    useEffect(() => {
        fetchMeetingTimes();
        fetchTimesets();
        console.log(timings)
    }, [timeset]);

    const handleEditClick = (timing) => {
        setEditTimingId(timing.id);
        setEditFormData({
            day: timing.day,
            time: timing.time
        });
    };

    const handleEditFormChange = (e) => {
        const { name, value } = e.target;
        setEditFormData({
            ...editFormData,
            [name]: value
        });
    };

    const handleCancelClick = () => {
        setEditTimingId(null);
        setEditFormData({
            day: '',
            time: ''
        });
    };

    const handleSaveClick = async () => {
        try {
            console.log("Edata",editFormData);
            await generalPatch('viewsets/meetingtimes/',editTimingId,editFormData)
            setEditTimingId(null);
            fetchMeetingTimes(); // Refresh the data
        } catch (error) {
            console.log(error);
        }
    };

    const handleDeleteClick = async (timingId,timingName) => {
        // try {
        //     await generalDelete('viewsets/meetingtimes/',timingId)
        //     fetchMeetingTimes(); // Refresh the data
        // } catch (error) {
        //     console.log(error);
        // }
        setDeleteTimingId(timingId)
        setDeleteTimingName(timingName)
        setShowDeleteModal1(true)
        fetchMeetingTimes();
    };
    const handleDeleteTimesetClick = async (timesetId, timesetName) => {
        setDeleteTimesetId(timesetId)
        setDeleteTimesetName(timesetName)
        setShowDeleteModal2(true)
        fetchTimesets(); 
        fetchMeetingTimes();
    }

    return (
        <div>
            <Navbar title="Home" />
            <div className="centerholder">
                <DeleteModal show={showDeleteModal1} id={deleteTimingId} name={deleteTimingName} endpoint={'viewsets/meetingtimes/'} onClose={() => setShowDeleteModal1(false)} itemKind={'Timing'}></DeleteModal>
            </div>
            <div className="centerholder">
                <DeleteModal show={showDeleteModal2} id={deleteTimesetId} name={deleteTimesetName} endpoint={'viewsets/timesets/'} onClose={() => setShowDeleteModal2(false)} itemKind={'Timeset'}></DeleteModal>
            </div>
            <div className="h-[60vh] w-[40vw] overflow-y-auto rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
                <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">
                    Timings
                </h4>
                {/* {displayMessage} */}
                <div className="input-box centerholder">
                    <label htmlFor="timesets">Choose a Timeset:</label>
                    <select
                    id="timesets"
                    required
                    >
                    {timesets.map(a_timeset => (
                        <option key={a_timeset.id} onClick={()=>{setTimeSet(a_timeset)}}>{a_timeset.name}</option>
                    ))}
                    </select>
                </div>
                <div className="centerholder">
                    {timeset&&<button className='flex items-center justify-center rounded-md bg-primary p-2 text-white hover:bg-opacity-95' onClick={()=>{handleDeleteTimesetClick(timeset.id, timeset.name)}}>Delete {timeset.name}</button>}
                </div>


                <div className="flex flex-col">
                    {/* <div className="grid grid-cols-4 rounded-sm bg-gray-2 dark:bg-meta-4 sm:grid-cols-5"> */}
                    <div className="grid grid-cols-2 rounded-sm bg-gray-2 dark:bg-meta-4 sm:grid-cols-2">
                        <div className="p-2.5 xl:p-5">
                            <h5 className="text-sm font-medium uppercase xsm:text-base">
                                Day
                            </h5>
                        </div>
                        <div className="p-2.5 text-center xl:p-5">
                            <h5 className="text-sm font-medium uppercase xsm:text-base">
                                Time
                            </h5>
                        </div>
                        {/* <div className="p-2.5 text-center xl:p-5">
                            <h5 className="text-sm font-medium uppercase xsm:text-base">
                                Update
                            </h5>
                        </div>
                        <div className="p-2.5 text-center xl:p-5">
                            <h5 className="text-sm font-medium uppercase xsm:text-base">
                                Delete
                            </h5>
                        </div> */}
                    </div>

                    {timings?(timings.map((timing, key) => (
                        <div
                            className={`grid grid-cols-2 sm:grid-cols-2 ${
                                key === timings.length - 1 ? '' : 'border-b border-stroke dark:border-strokedark'
                            }`}
                            key={key}
                        >
                            {editTimingId === timing.id ? (
                                <>
                                    {/* <div className="flex items-center justify-center p-2.5 xl:p-5">
                                        <input
                                            type="text"
                                            name="day"
                                            value={editFormData.day}
                                            onChange={handleEditFormChange}
                                            className="form-control"
                                        />
                                    </div>
                                    <div className="flex items-center justify-center p-2.5 xl:p-5">
                                        <input
                                            type="text"
                                            name="time"
                                            value={editFormData.time}
                                            onChange={handleEditFormChange}
                                            className="form-control"
                                        />
                                    </div>
                                    <div className="flex items-center justify-center p-2.5 xl:p-5">
                                        <button onClick={handleSaveClick} className="btn btn-primary">Save</button>
                                        <button onClick={handleCancelClick} className="btn btn-secondary ml-2">Cancel</button>
                                    </div> */}
                                </>
                            ) : (
                                <>
                                    <div className="flex items-center justify-center p-2.5 xl:p-5">
                                        <p className="text-black dark:text-white">{timing.day}</p>
                                    </div>
                                    <div className="flex items-center justify-center p-2.5 xl:p-5">
                                        <p className="text-black dark:text-white">{timing.time}</p>
                                    </div>
                                    {/* <div className="flex items-center justify-center p-2.5 xl:p-5">
                                        <button onClick={() => handleEditClick(timing)} className="btn btn-warning">Edit</button>
                                    </div>
                                    <div className="flex items-center justify-center p-2.5 xl:p-5">
                                        <button onClick={() => handleDeleteClick(timing.id,`${timing.day} : ${timing.time}`)} className="btn btn-warning">Delete</button>
                                    </div> */}
                                </>
                            )}
                        </div>
                    ))):<></>}
                </div>
            </div>
        </div>
    );
};

export default TimingTable;
