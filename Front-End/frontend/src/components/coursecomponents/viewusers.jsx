import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../navigation';
import { generalPatch, generalDelete, searchFunction } from '../reusable/functions';

const UserTable = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [users, setUsers] = useState([]);
    const [editUserId, setEditUserId] = useState(null);
    const [editFormData, setEditFormData] = useState({
        username: '',
        email: '',
    });

    const fetchData = async () => {
        try {
            const data = await searchFunction('viewsets/users', { search: searchQuery });
            setUsers(data);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchData();
    }, [searchQuery]);

    const handleEditClick = (user) => {
        setEditUserId(user.id);
        setEditFormData({
            username: user.username,
            email: user.email
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
        setEditUserId(null);
        setEditFormData({
            username: '',
            email: ''

        });
    };

    const handleSaveClick = async () => {
        try {
            await generalPatch('viewsets/users/', editUserId, editFormData);
            setEditUserId(null);
            fetchData();
        } catch (error) {
            console.log(error);
        }
    };

    const handleDisableClick = async (userId) => {
        try {
            await generalPatch('viewsets/users/disable/', userId, { disabled: true });
            fetchData(); // Refresh the data
        } catch (error) {
            console.log(error);
        }
    };

    const handleDeleteClick = async (userId) => {
        try {
            await generalDelete('viewsets/users/', userId);
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
                    Users
                </h4>

                <div className="flex flex-col">
                    <div className="grid grid-cols-3 rounded-sm bg-gray-2 dark:bg-meta-4 sm:grid-cols-5">
                        <div className="p-2.5 xl:p-5">
                            <h5 className="text-sm font-medium uppercase xsm:text-base">
                                Username
                            </h5>
                        </div>
                        <div className="p-2.5 text-center xl:p-5">
                            <h5 className="text-sm font-medium uppercase xsm:text-base">
                                Email
                            </h5>
                        </div>
                        <div className="p-2.5 text-center xl:p-5">
                            <h5 className="text-sm font-medium uppercase xsm:text-base">
                                Update
                            </h5>
                        </div>
                        <div className="p-2.5 text-center xl:p-5">
                            <h5 className="text-sm font-medium uppercase xsm:text-base">
                                Disable
                            </h5>
                        </div>
                    </div>

                    {users.map((user, key) => (
                        <div
                            className={`grid grid-cols-3 sm:grid-cols-5 ${
                                key === users.length - 1 ? '' : 'border-b border-stroke dark:border-strokedark'
                            }`}
                            key={key}
                        >
                            {editUserId === user.id ? (
                                <>
                                    <div className="flex items-center justify-center p-2.5 xl:p-5">
                                        <input
                                            type="text"
                                            name="username"
                                            value={editFormData.username}
                                            onChange={handleEditFormChange}
                                            className="form-control"
                                        />
                                    </div>
                                    <div className="flex items-center justify-center p-2.5 xl:p-5">
                                        <input
                                            type="text"
                                            name="email"
                                            value={editFormData.email}
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
                                        <p className="text-black dark:text-white">{user['name']}</p>
                                    </div>
                                    <div className="flex items-center justify-center p-2.5 xl:p-5">
                                        <p className="text-black dark:text-white">{user['email']}</p>
                                    </div>
                                    <div className="flex items-center justify-center p-2.5 xl:p-5">
                                        <button onClick={() => handleEditClick(user)} className="btn btn-warning">Edit</button>
                                    </div>
                                    <div className="flex items-center justify-center p-2.5 xl:p-5">
                                        <button onClick={() => handleDisableClick(user.id)} className="btn btn-danger ml-2">Disable</button>
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

export default UserTable;
