import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../navigation';
import { generalPatch, generalDelete, searchFunction,makeNotification } from '../reusable/functions';
import { DeleteModal } from '../reusable/modals';

const StreamTable = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [streams, setStreams] = useState([]);
    const [editStreamId, setEditStreamId] = useState(null);

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteStreamId,setDeleteStreamId] = useState(null);
    const [deleteStreamName,setDeleteStreamName] = useState(null);


    const [editFormData, setEditFormData] = useState({
        code :'',
        lessons_per_week: ''
    });

    const fetchData = async () => {
        try {
            const data = await searchFunction('viewsets/streams', { search: searchQuery });
            setStreams(data);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchData();
    }, [searchQuery]);

    const handleEditClick = (stream) => {
        setEditStreamId(stream.id);
        setEditFormData({
            code: stream.code,
            lessons_per_week: stream.lessons_per_week
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
        setEditStreamId(null);
        setEditFormData({
            lessons_per_week: ''
        });
    };

    const handleSaveClick = async () => {
        try {
            await generalPatch('viewsets/streams/', editStreamId, editFormData);
            setEditStreamId(null);
            fetchData(); // Refresh the data
        } catch (error) {
            console.log(error);
        }
    };

    const handleDeleteClick = async (streamId, streamName) => {
        // try {
        //     await generalDelete('viewsets/streams/', streamId);
        //     await makeNotification(`Stream ${streamId} has been removed by Scheduler`);
        //     fetchData(); // Refresh the data
        // } catch (error) {
        //     console.log(error);
        // }

        setDeleteStreamId(streamId)
        setDeleteStreamName(streamName)
        setShowDeleteModal(true)
        fetchData();
    };

    return (
        <div>
            <Navbar title="Home" />
            <div className="centerholder">
                <DeleteModal show={showDeleteModal} id={deleteStreamId} name={deleteStreamName} endpoint={'viewsets/streams/'} onClose={() => setShowDeleteModal(false)} itemKind={'Stream'}></DeleteModal>
            </div>

            <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
                <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">
                    Streams
                </h4>

                <div className="flex flex-col">
                    {/* <div className="grid grid-cols-2 rounded-sm bg-gray-2 dark:bg-meta-4 sm:grid-cols-3">
                        <div className="p-2.5 xl:p-5">
                            <h5 className="text-sm font-medium uppercase xsm:text-base">
                                Stream ID
                            </h5>
                        </div>
                        <div className="p-2.5 xl:p-5">
                            <h5 className="text-sm font-medium uppercase xsm:text-base">
                                Lessons per Week
                            </h5>
                        </div>
                        <div className="p-2.5 xl:p-5">
                            <h5 className="text-sm font-medium uppercase xsm:text-base">
                                Update
                            </h5>
                        </div>
                        <div className="p-2.5 xl:p-5">
                            <h5 className="text-sm font-medium uppercase xsm:text-base">
                                Delete
                            </h5>
                        </div>
                    </div> */}
                    <div className="grid grid-cols-4 rounded-sm bg-gray-2 dark:bg-meta-4 sm:grid-cols-4">
                        <div className="p-2.5 xl:p-5">
                            <h5 className="text-sm font-medium uppercase xsm:text-base">
                                Stream Code
                            </h5>
                        </div>
                        <div className="p-2.5 xl:p-5">
                            <h5 className="text-sm font-medium uppercase xsm:text-base">
                                Lessons per Week
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

                    {streams.map((stream, key) => (
                        <div
                            className={`grid grid-cols-4 sm:grid-cols-4 ${
                                key === streams.length - 1 ? '' : 'border-b border-stroke dark:border-strokedark'
                            }`}
                            key={key}
                        >
                            {editStreamId === stream.id ? (
                                <>

                                    <div className="flex items-center justify-center p-2.5 xl:p-5">
                                        <input
                                            type="text"
                                            name="code"
                                            value={editFormData.code}
                                            onChange={handleEditFormChange}
                                            className="form-control"
                                        />
                                    </div>
                                    <div className="flex items-center justify-center p-2.5 xl:p-5">
                                        <input
                                            type="text"
                                            name="lessons_per_week"
                                            value={editFormData.lessons_per_week}
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
                                        <p className="text-black dark:text-white">{stream.code}</p>
                                    </div>
                                    <div className="flex items-center justify-center p-2.5 xl:p-5">
                                        <p className="text-black dark:text-white">{stream.lessons_per_week}</p>
                                    </div>
                                    <div className="flex items-center justify-center p-2.5 xl:p-5">
                                        <button onClick={() => handleEditClick(stream)} className="btn btn-warning">Edit</button>
                                    </div>
                                    <div className="flex items-center justify-center p-2.5 xl:p-5">
                                        <button onClick={() => handleDeleteClick(stream.id, stream.code)} className="btn btn-danger">Delete</button>
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

export default StreamTable;
