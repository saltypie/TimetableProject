// timingTable.js

import React, { useEffect, useState } from 'react';
import '../Login.css';
import axios from 'axios';
import Navbar from '../navigation';
import {searchFunction,generalPatch, generalDelete} from '../reusable/functions';

const TimingTable = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [timings, setTimings] = useState([]);
    const [editTimingId, setEditTimingId] = useState(null);
    const [editFormData, setEditFormData] = useState({
        day: '',
        time: ''
    });

    const fetchData = async () => {
        try {
            const data = await searchFunction('viewsets/meetingtimes', { search: searchQuery });
            setTimings(data);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchData();
    }, [searchQuery]);

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
            fetchData(); // Refresh the data
        } catch (error) {
            console.log(error);
        }
    };

    const handleDeleteClick = async (timingId) => {
        try {
            await generalDelete('viewsets/meetingtimes/',timingId)
            fetchData(); // Refresh the data
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div>
            <Navbar title="Home" />
            <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
                <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">
                    Timings
                </h4>

                <div className="flex flex-col">
                    <div className="grid grid-cols-4 rounded-sm bg-gray-2 dark:bg-meta-4 sm:grid-cols-5">
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
                        <div className="p-2.5 text-center xl:p-5">
                            <h5 className="text-sm font-medium uppercase xsm:text-base">
                                Update
                            </h5>
                        </div>
                        <div className="p-2.5 text-center xl:p-5">
                            <h5 className="text-sm font-medium uppercase xsm:text-base">
                                Delete
                            </h5>
                        </div>
                    </div>

                    {timings.map((timing, key) => (
                        <div
                            className={`grid grid-cols-4 sm:grid-cols-5 ${
                                key === timings.length - 1 ? '' : 'border-b border-stroke dark:border-strokedark'
                            }`}
                            key={key}
                        >
                            {editTimingId === timing.id ? (
                                <>
                                    <div className="flex items-center justify-center p-2.5 xl:p-5">
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
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="flex items-center justify-center p-2.5 xl:p-5">
                                        <p className="text-black dark:text-white">{timing.day}</p>
                                    </div>
                                    <div className="flex items-center justify-center p-2.5 xl:p-5">
                                        <p className="text-black dark:text-white">{timing.time}</p>
                                    </div>
                                    <div className="flex items-center justify-center p-2.5 xl:p-5">
                                        <button onClick={() => handleEditClick(timing)} className="btn btn-warning">Edit</button>
                                    </div>
                                    <div className="flex items-center justify-center p-2.5 xl:p-5">
                                        <button onClick={() => handleDeleteClick(timing.id)} className="btn btn-warning">Delete</button>
                                    </div>
                                </>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TimingTable;
