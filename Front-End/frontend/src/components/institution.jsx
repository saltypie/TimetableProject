import React, { useEffect, useState } from 'react';
import { searchFunction, generalPatch } from './reusable/functions';
import { Link } from 'react-router-dom';
import Navbar from './navigation';

const InstitutionProfile = () => {
  const [institution, setInstitution] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editFormData, setEditFormData] = useState({});

  const fetchInstitutionDetails = async () => {
    try {
      const data = await searchFunction('viewsets/institutions', { search: localStorage.getItem('institution') });
      if (data.length > 0) {
        setInstitution(data[0]);
        setEditFormData(data[0]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchInstitutionDetails();
  }, []);

  const handleEditClick = () => {
    setEditMode(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({
      ...editFormData,
      [name]: value
    });
  };

  const handleSaveClick = async () => {
    try {
      await generalPatch('viewsets/institutions/', institution.id, editFormData);
      setInstitution(editFormData);
      setEditMode(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleCancelClick = () => {
    setEditMode(false);
    setEditFormData(institution);
  };

  if (!institution) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="overflow-hidden rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <Navbar title="Home"></Navbar>
        <br />
        <div><br />
          <img
            src='https://live.staticflickr.com/4574/24791500728_8fd1eeeebc_c.jpg'
            alt="profile cover"
            className="w-full rounded-tl-sm rounded-tr-sm object-cover object-center"
          />
        </div>

        <div className="px-4 pb-6 text-center lg:pb-8 xl:pb-11.5">
          {editMode ? (
            <>
              Name: 
              <input
                type="text"
                name="name"
                value={editFormData.name}
                onChange={handleInputChange}
                className="justify-center text-sm text-gray-600 border-gray dark:text-gray-400 rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              />
              <hr />
              <br />
              Email:
              <input
                type="email"
                name="email"
                value={editFormData.email}
                onChange={handleInputChange}
                className="justify-center text-sm text-gray-600 border-gray dark:text-gray-400 rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              />
              <br /><br />
              Phone: 
              <input
                type="text"
                name="phone"
                value={editFormData.phone}
                onChange={handleInputChange}
                className="justify-center text-sm text-gray-600 border-gray dark:text-gray-400 rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              />
              <div className="mt-6">
                <button onClick={handleSaveClick} className="text-sm text-blue-500 hover:underline">Save</button>
                <button onClick={handleCancelClick} className="text-sm text-blue-500 hover:underline ml-4">Cancel</button>
              </div>
            </>
          ) : (
            <>

              <h3 className="text-xl font-semibold text-black dark:text-white">
                {institution.name}
              </h3>
              <hr />
              <br />
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Email: {institution.email}
              </p>
              <br />
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Phone: {institution.phone}
              </p>
              <div className="mt-6 justify-center">
                {localStorage.getItem("role")==="scheduler" ? <button onClick={handleEditClick} className="text-sm text-blue-500 hover:underline">Edit Profile</button> : <></>}
                
                <br />
                <Link to='/schedulerdash' className="text-sm text-blue-500 hover:underline ml-4">Dashboard</Link>
                <br />
                <Link to='/schedules' className="text-sm text-blue-500 hover:underline">Schedules</Link>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default InstitutionProfile;
