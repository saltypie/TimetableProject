import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../Login.css';
import axios from 'axios';
import { generalPatch, searchFunction } from './functions';
// import { Input } from "@material-tailwind/react";

// Modal Component for Registering an Institution
const RegisterInstitutionModal = ({ isOpen, onClose, onRegister }) => {
    const [institutionData, setInstitutionData] = useState({
        name: '',
        address: '',
        email: '',
        phone: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setInstitutionData({ ...institutionData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onRegister(institutionData);
    };

    if (!isOpen) return null;

    return (
        <div className="modal">
            <div className="modal-content">
                <span className="close" onClick={onClose}>&times;</span>
                <h2>Register Institution</h2>
                <form onSubmit={handleSubmit}>
                    <input type="text" name="name" placeholder="Institution Name" onChange={handleChange} required />
                    <input type="text" name="address" placeholder="Address" onChange={handleChange} required />
                    <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
                    <input type="text" name="phone" placeholder="Phone" onChange={handleChange} required />
                    <button type="submit">Register</button>
                </form>
            </div>
        </div>
    );
};

const HomeTiles = ({ is_institution_approved, is_application_accepted, role, institution }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchData = async () => {
        try {
            const response = await searchFunction('/viewsets/institutions', { search: searchQuery });
            console.log(`Hi my name is ${response[0].name}`)
            setSearchResults(response);
        } catch (error) {
            console.log(error);
        }
    };

    const handleInstitutionSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleInstructorOptionClick = async () => {
        try {
            await generalPatch('viewsets/institutionmembers/', localStorage.getItem('user_id'), { role: 'instructor' });
        } catch (error) {
            alert(error);
        }
    };

    const handleSchedulerOptionClick = async () => {
        try {
            const role_data = await searchFunction('viewsets/roles/searchorcreate', { search: 'scheduler' });
            await generalPatch('viewsets/institutionmembers/', localStorage.getItem('user_id'), { role: role_data.id });
            localStorage.setItem('role', 'scheduler');
        } catch (error) {
            alert(error);
        }
    };

    const handleInstitutionClick = async (institute) => {
        try {
            // await axios.patch(`/api/viewsets/institutionmembers/${localStorage.getItem('user_id')}`, { institution: institutionId });
            console.log(institute)
            await generalPatch(`/viewsets/institutionmembers/`,localStorage.getItem('user_id') ,{institution: institute.id});
            localStorage.setItem('is_institution_approved', 'true')
            localStorage.setItem('institution', institute.name)
        } catch (error) {
            console.log(error);
        }
    };

    const handleRegisterInstitution = async (institutionData) => {
        try {
            await axios.post('/api/viewsets/institutions', institutionData);
            setIsModalOpen(false);
            fetchData();
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (searchQuery) {
            fetchData();
        }
    }, [searchQuery]);

    const renderActions = () => {
        // alert(is_institution_approved)
        if (role === 'unassigned') {
            return (
                <div>
                    Do You Want To Use Timetabulous as an
                    <div onClick={handleInstructorOptionClick}>Instructor</div>
                    <div onClick={handleSchedulerOptionClick}>Scheduler</div>
                </div>
            );
        } else if (role === 'scheduler' && is_institution_approved==="false") {
            return (
                <div>
                    <br /><hr /><br />
                    Your Institution is Awaiting Approval
                    <div className="centerholder">
                        <img className='centerholder' src="https://media.tenor.com/j6D0YKYLKsYAAAAM/paperwork-piles.gif" alt="" />
                    </div>
                </div>
            );
        } else if (role === 'scheduler' && institution === "null") {
            return (
                <div className=''>
                    <br />
                    <div onClick={() => setIsModalOpen(true)} className="rounded-sm border border-stroke bg-white py-6 px-7.5 shadow-default dark:border-strokedark dark:bg-boxdark">Register Institution</div>
                    <br />
                    <div className="search rounded-sm border border-stroke bg-white py-6 px-7.5 shadow-default dark:border-strokedark dark:bg-boxdark">
                        <div>Search for Institution</div>
                        {/* <Input onChange={handleInstitutionSearchChange} name="searchQuery" placeholder="Search Institution" label="Find Institution" /> */}
                        <input onChange={handleInstitutionSearchChange} name="searchQuery" placeholder="Search Institution" />
                        <div className="results">
                            {searchResults.map((result) => (
                                <div key={result.id} onClick={() => handleInstitutionClick(result.id)} className="search rounded-sm border border-stroke bg-white py-6 px-7.5 shadow-default dark:border-strokedark dark:bg-boxdark">{result.name}</div>
                            ))}
                        </div>
                    </div>
                </div>
            );
        } else if (role === 'instructor' && institution === "null") {
            return (
                <div>
                    <div className="search">
                        <input 
                            onChange={handleInstitutionSearchChange} 
                            name="searchQuery" 
                            placeholder="Search Institution" 
                            className='rounded-sm border border-stroke bg-white py-6 px-7.5 shadow-default dark:border-strokedark dark:bg-boxdark'
                        />
                        <div className="results">
                            {searchResults.map((result) => (
                                <div key={result.id} onClick={() => handleInstitutionClick(result)}>{result.name}</div>
                            ))}
                        </div>
                    </div>
                </div>
            );
        } else if (role === 'admin') {
            return (
                <div>
                    Welcome
                    <div><Link to="/dashboard">View Dashboard</Link></div>
                    <div><Link to="/profile">View Profile</Link></div>
                </div>
            );
        } else if (role === 'scheduler' && is_institution_approved) {
            return (
                <div>
                    <br />
                    <div className="rounded-sm border border-stroke bg-white py-6 px-7.5 shadow-default dark:border-strokedark dark:bg-boxdark"><Link to="/schedules">View Schedules</Link></div>
                    <div className="rounded-sm border border-stroke bg-white py-6 px-7.5 shadow-default dark:border-strokedark dark:bg-boxdark"><Link to="/constraints">View Constraints</Link></div>
                    <div className="rounded-sm border border-stroke bg-white py-6 px-7.5 shadow-default dark:border-strokedark dark:bg-boxdark"><Link to="/messages">View Messages</Link></div>
                </div>
            );
        } else if (role === 'instructor') {
            return (
                <div>
                    Welcome
                    <div><Link to="/messages">Most Recent Message (Click To See More Messages...)</Link></div>
                    <div><Link to="/schedules">View Schedules</Link></div>
                </div>
            );
        }
    };

    return (
        <div>
            {renderActions()}
            <RegisterInstitutionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onRegister={handleRegisterInstitution} />
        </div>
    );
}

export default HomeTiles;
