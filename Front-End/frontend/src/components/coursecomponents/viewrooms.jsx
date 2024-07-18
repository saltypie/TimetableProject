import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../navigation';
import { generalPatch, generalDelete, searchFunction, makeNotification } from '../reusable/functions';
import { DeleteModal } from '../reusable/modals';

const RoomTable = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [rooms, setRooms] = useState([]);
    const [editRoomId, setEditRoomId] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteRoomId,setDeleteRoomId] = useState(null);
    const [deleteRoomName,setDeleteRoomName] = useState(null);

    const [editFormData, setEditFormData] = useState({
        r_number: '',
        seating_capacity: ''
    });

    const fetchData = async () => {
        try {
            const data = await searchFunction('viewsets/rooms', { search: searchQuery });
            setRooms(data);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchData();
        console.log(showDeleteModal);
    }, [searchQuery]);

    const handleEditClick = (room) => {
        setEditRoomId(room.id);
        setEditFormData({
            r_number: room.r_number,
            seating_capacity: room.seating_capacity
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
        setEditRoomId(null);
        setEditFormData({
            r_number: '',
            seating_capacity: ''
        });
    };

    const handleSaveClick = async () => {
        try {
            await generalPatch('viewsets/rooms/', editRoomId, editFormData);
            await makeNotification(`Room ${editFormData.r_number} has been updated by Scheduler`);
            setEditRoomId(null);
            fetchData(); 
            // Refresh the data
        } catch (error) {
            console.log(error);
        }
    };

    const handleDeleteClick = async (roomId,roomName) => {
        // try {
        //     await generalDelete('viewsets/rooms/', roomId);
        //     await makeNotification(`Room ${editFormData.r_number} has been removed by Scheduler`);
        //     fetchData(); // Refresh the data
        // } catch (error) {
        //     console.log(error);
        // }
        setDeleteRoomId(roomId)
        setDeleteRoomName(roomName)
        setShowDeleteModal(true)
        fetchData();

    };

    return (
        <div>
            <Navbar title="Home" />
            <div className="centerholder">
                <DeleteModal show={showDeleteModal} id={deleteRoomId} name={deleteRoomName} endpoint={'viewsets/rooms/'} onClose={() => setShowDeleteModal(false)} itemKind={'Room'}></DeleteModal>
            </div>
            <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
                <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">
                    Rooms
                </h4>

                <div className="flex flex-col">
                    <div className="grid grid-cols-3 rounded-sm bg-gray-2 dark:bg-meta-4 sm:grid-cols-5">
                        <div className="p-2.5 xl:p-5">
                            <h5 className="text-sm font-medium uppercase xsm:text-base">
                                Room Number
                            </h5>
                        </div>
                        <div className="p-2.5 text-center xl:p-5">
                            <h5 className="text-sm font-medium uppercase xsm:text-base">
                                Seating Capacity
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

                    {rooms.map((room, key) => (
                        <div
                            className={`grid grid-cols-3 sm:grid-cols-5 ${
                                key === rooms.length - 1 ? '' : 'border-b border-stroke dark:border-strokedark'
                            }`}
                            key={key}
                        >
                            {editRoomId === room.id ? (
                                <>
                                    <div className="flex items-center justify-center p-2.5 xl:p-5">
                                        <input
                                            type="text"
                                            name="r_number"
                                            value={editFormData.r_number}
                                            onChange={handleEditFormChange}
                                            className="form-control"
                                        />
                                    </div>
                                    <div className="flex items-center justify-center p-2.5 xl:p-5">
                                        <input
                                            type="text"
                                            name="seating_capacity"
                                            value={editFormData.seating_capacity}
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
                                        <p className="text-black dark:text-white">{room.r_number}</p>
                                    </div>
                                    <div className="flex items-center justify-center p-2.5 xl:p-5">
                                        <p className="text-black dark:text-white">{room.seating_capacity}</p>
                                    </div>
                                    <div className="flex items-center justify-center p-2.5 xl:p-5">
                                        <button onClick={() => handleEditClick(room)} className="btn btn-warning">Edit</button>
                                    </div>
                                    <div className="flex items-center justify-center p-2.5 xl:p-5">
                                        {/* <button onClick={() => handleDeleteClick(room.id)} className="btn btn-danger">Delete</button> */}
                                        <button onClick={() => handleDeleteClick(room.id,room.r_number)} className="btn btn-danger">Delete</button>
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

export default RoomTable;
