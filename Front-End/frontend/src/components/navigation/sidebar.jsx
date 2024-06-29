import React from 'react';
import './AdminSidebar.css';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { FaBars, FaHome, FaPencilRuler, FaPlus, FaUser, FaTable, FaTimes, FaUniversity, FaBell, FaTachometerAlt } from 'react-icons/fa';

const Sidebar = () => {
    const [open, setOpen] = useState((JSON.parse(localStorage.getItem('hamburger_open'))));
    const [tablesDropdownOpen, setTablesDropdownOpen] = useState(false);
    const [constraintsDropdownOpen, setConstraintsDropdownOpen] = useState(false);
    const [viewConstraintsDropdownOpen, setViewConstraintsDropdownOpen] = useState(false);

    const handleSideClick = (open) => {
        setOpen(!open);
        localStorage.setItem('hamburger_open', !open);
    }

    if (open) {
        if (localStorage.getItem('role') === 'admin') {
            return (
                <div className="sidebar">
                    <ul>
                        <li onClick={() => handleSideClick(open)}><FaTimes /></li>
                        <li><Link to="/"><FaHome className='inline' /> Home </Link></li>
                        <li><Link to="You"><FaUser className='inline' /> Profile</Link></li>
                        <li><Link to="dashboard"><FaTachometerAlt className='inline' /> Dashboard</Link></li>
                        <li>
                            <FaTable className='inline' onClick={() => setTablesDropdownOpen(!tablesDropdownOpen)} /> Tables
                            {tablesDropdownOpen && (
                                <ul className="dropdown">
                                    <li><Link to="/tables/1">Table 1</Link></li>
                                    <li><Link to="/tables/2">Table 2</Link></li>
                                    <li><Link to="/tables/3">Table 3</Link></li>
                                </ul>
                            )}
                        </li>
                    </ul>
                </div>
            );
        } else if (localStorage.getItem('role') === 'scheduler') {
            return (
                <div className="sidebar">
                    <ul>
                        <li onClick={() => handleSideClick(open)}><FaTimes /></li>
                        <li><Link to="/"><FaHome className='inline' /> Home </Link></li>
                        <li><Link to="You"><FaUser className='inline' /> Profile</Link></li>
                        <li>
                            <FaPlus className='inline' onClick={() => setConstraintsDropdownOpen(!constraintsDropdownOpen)} /> Add Constraints
                            {constraintsDropdownOpen && (
                                <ul className="dropdown">
                                    <li><Link to="/AddTiming">Timing</Link></li>
                                    <li><Link to="/AddRoom">Room</Link></li>
                                    <li><Link to="/AddDepartment">Department</Link></li>
                                    <li><Link to="/AddCourse">Course</Link></li>
                                    <li><Link to="/AddStream">Stream</Link></li>
                                </ul>
                            )}
                        </li>
                        <li><Link to="/institutionprofile"><FaUniversity className='inline' /> Institution</Link></li>
                        <li>
                            <FaPencilRuler className='inline' onClick={() => setViewConstraintsDropdownOpen(!viewConstraintsDropdownOpen)} /> View/Edit Constraints
                            {viewConstraintsDropdownOpen && (
                                <ul className="dropdown">
                                    <li><Link to="/Timing">Timing</Link></li>
                                    <li><Link to="/Room">Room</Link></li>
                                    <li><Link to="/Department">Department</Link></li>
                                    <li><Link to="/Course">Course</Link></li>
                                    <li><Link to="/Stream">Stream</Link></li>
                                </ul>
                            )}
                        </li>
                        <li><Link to="/schedules"><FaTable className='inline' /> Schedules</Link></li>
                        <li><Link to="/notifications"><FaBell className='inline' /> Notifications (Coming Soon)</Link></li>
                    </ul>
                </div>
            );

        } else if (localStorage.getItem('role') === 'instructor') {
            return (
                <div className="sidebar">
                    <ul>
                        <li onClick={() => handleSideClick(open)}><FaTimes /></li>
                        <li><Link to="/"><FaHome className='inline' /> Home </Link></li>
                        <li><Link to="You"><FaUser className='inline' /> Profile</Link></li>
                        <li><Link to="/institutionprofile"><FaUniversity className='inline' /> Institution</Link></li>
                        <li><Link to="/schedules"><FaTable className='inline' /> Schedules</Link></li>
                        <li><Link to="/notifications"><FaBell className='inline' /> Notifications (Coming Soon)</Link></li>
                    </ul>
                </div>
            );
        }
    } else {
        return (
            <div className="hamburger centerholder" onClick={() => handleSideClick(open)}>
                <FaBars />
            </div>
        );
    }
}

export default Sidebar;
