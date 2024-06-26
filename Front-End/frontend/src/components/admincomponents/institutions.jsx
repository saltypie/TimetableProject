import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { searchFunction, generalPatch, generalDelete } from '../reusable/functions';

const CrudTable = ({ titles, colNames, colTitles, endpoint }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [items, setItems] = useState([]);
    const [editItemId, setEditItemId] = useState(null);
    const initialFormData = colNames.reduce((acc, col) => ({ ...acc, [col]: '' }), {});
    const [editFormData, setEditFormData] = useState(initialFormData);

    // Define which columns are boolean
    const booleanColumns = ['is_institution_approved', 'another_boolean_column']; // Add more boolean columns as needed

    const fetchData = async () => {
        try {
            const data = await searchFunction(endpoint, { search: searchQuery });
            setItems(data);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchData();
    }, [searchQuery]);

    const handleEditClick = (item) => {
        setEditItemId(item.id);
        const formData = colNames.reduce((acc, col) => ({ ...acc, [col]: item[col] }), {});
        setEditFormData(formData);
    };

    const handleEditFormChange = (e) => {
        const { name, value, type, checked } = e.target;
        setEditFormData({
            ...editFormData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleCancelClick = () => {
        setEditItemId(null);
        setEditFormData(initialFormData);
    };

    const handleSaveClick = async () => {
        try {
            await generalPatch(`${endpoint}/`, editItemId, editFormData);
            setEditItemId(null);
            fetchData(); // Refresh the data
        } catch (error) {
            console.log(error);
        }
    };

    const handleDeleteClick = async (itemId) => {
        try {
            await generalDelete(`${endpoint}/`, itemId);
            fetchData(); // Refresh the data
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div>
            <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
                <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">
                    {titles}
                </h4>

                <div className="flex flex-col">
                    <div className={`grid grid-cols-${colTitles.length+2} rounded-sm bg-gray-2 dark:bg-meta-4 sm:grid-cols-${colTitles.length+2}`}>
                        {colTitles.map((col, index) => (
                            <div key={index} className="p-2.5 xl:p-5">
                                <h5 className="text-sm font-medium uppercase xsm:text-base">
                                    {col}
                                </h5>
                            </div>
                        ))}
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

                    {items.map((item, key) => (
                        <div
                            className={`grid grid-cols-6 sm:grid-cols-${colNames.length+2} ${
                                key === items.length - 1 ? '' : 'border-b border-stroke dark:border-strokedark'
                            }`}
                            key={key}
                        >
                            {editItemId === item.id ? (
                                <>
                                    {colNames.map((col, index) => (
                                        <div key={index} className="flex items-center justify-center p-2.5 xl:p-5">
                                            {booleanColumns.includes(col) ? (
                                                <input
                                                    type="checkbox"
                                                    name={col}
                                                    checked={editFormData[col]}
                                                    onChange={handleEditFormChange}
                                                    className="form-control"
                                                />
                                            ) : (
                                                <input
                                                    type="text"
                                                    name={col}
                                                    value={editFormData[col]}
                                                    onChange={handleEditFormChange}
                                                    className="form-control"
                                                />
                                            )}
                                        </div>
                                    ))}
                                    <div className="flex items-center justify-center p-2.5 xl:p-5">
                                        <button onClick={handleSaveClick} className="btn btn-primary">Save</button>
                                        <button onClick={handleCancelClick} className="btn btn-secondary ml-2">Cancel</button>
                                    </div>
                                </>
                            ) : (
                                <>
                                    {colNames.map((col, index) => (
                                        <div key={index} className="flex items-center justify-center p-2.5 xl:p-5">
                                            <p className="text-black dark:text-white">
                                                {booleanColumns.includes(col) ? (item[col] ? 'True' : 'False') : item[col]}
                                            </p>
                                        </div>
                                    ))}
                                    <div className="flex items-center justify-center p-2.5 xl:p-5">
                                        <button onClick={() => handleEditClick(item)} className="btn btn-warning">Edit</button>
                                    </div>
                                    <div className="flex items-center justify-center p-2.5 xl:p-5">
                                        <button onClick={() => handleDeleteClick(item.id)} className="btn btn-warning">Delete</button>
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

export default CrudTable;
