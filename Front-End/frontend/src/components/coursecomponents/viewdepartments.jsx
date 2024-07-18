import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../navigation';
import { generalPatch, generalDelete, searchFunction,makeNotification } from '../reusable/functions';
import { DeleteModal } from '../reusable/modals';


const DepartmentTable = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [departments, setDepartments] = useState([]);
    const [editDepartmentId, setEditDepartmentId] = useState(null);

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteDepartmentId,setDeleteDepartmentId] = useState(null);
    const [deleteDepartmentName,setDeleteDepartmentName] = useState(null);

    const [editFormData, setEditFormData] = useState({
        dept_name: ''
    });

    const fetchData = async () => {
        try {
            const data = await searchFunction('viewsets/departments', { search: searchQuery });
            setDepartments(data);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchData();
    }, [searchQuery]);

    const handleEditClick = (department) => {
        setEditDepartmentId(department.id);
        setEditFormData({
            dept_name: department.dept_name
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
        setEditDepartmentId(null);
        setEditFormData({
            dept_name: ''
        });
    };

    const handleSaveClick = async () => {
        try {
            await generalPatch('viewsets/departments/', editDepartmentId, editFormData);
            await makeNotification(`Department ${editFormData.dept_name} has been updated by Scheduler`);
            setEditDepartmentId(null);
            fetchData();
        } catch (error) {
            console.log(error);
        }
    };

    const handleDeleteClick = async (departmentId,departmentName) => {
        // try {
        //     await generalDelete('viewsets/departments/', departmentId);
        //     await makeNotification(`Department ${editFormData.dept_name} has been removed by Scheduler`);
        //     fetchData();
        // } catch (error) {
        //     console.log(error);
        // }
        setDeleteDepartmentId(departmentId)
        setDeleteDepartmentName(departmentName)
        setShowDeleteModal(true)
        fetchData();
    };

    return (
        <div>
            <Navbar title="Home" />
            <div className="centerholder">
                <DeleteModal show={showDeleteModal} id={deleteDepartmentId} name={deleteDepartmentName} endpoint={'viewsets/departments/'} onClose={() => setShowDeleteModal(false)} itemKind={'Department'}></DeleteModal>
            </div>

            <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
                <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">
                    Departments
                </h4>
                <div className="flex flex-col">
                    <div className="grid grid-cols-2 rounded-sm bg-gray-2 dark:bg-meta-4 sm:grid-cols-3">
                        <div className="p-2.5 xl:p-5">
                            <h5 className="text-sm font-medium uppercase xsm:text-base">
                                Department Name
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

                    {departments.map((department, key) => (
                        <div
                            className={`grid grid-cols-2 sm:grid-cols-3 ${
                                key === departments.length - 1 ? '' : 'border-b border-stroke dark:border-strokedark'
                            }`}
                            key={key}
                        >
                            {editDepartmentId === department.id ? (
                                <>
                                    <div className="flex items-center justify-center p-2.5 xl:p-5">
                                        <input
                                            type="text"
                                            name="dept_name"
                                            value={editFormData.dept_name}
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
                                        <p className="text-black dark:text-white">{department.dept_name}</p>
                                    </div>
                                    <div className="flex items-center justify-center p-2.5 xl:p-5">
                                        <button onClick={() => handleEditClick(department)} className="btn btn-warning">Edit</button>
                                    </div>
                                    <div className="flex items-center justify-center p-2.5 xl:p-5">
                                        <button onClick={() => handleDeleteClick(department.id,department.dept_name)} className="btn btn-danger">Delete</button>
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

export default DepartmentTable;
