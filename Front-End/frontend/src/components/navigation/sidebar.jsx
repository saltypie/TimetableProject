import React from 'react';
import './AdminSidebar.css';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import {FaBars,FaHome, FaPencilRuler, FaPlus, FaUser, FaTable,FaTimes, FaUniversity, FaBell, FaTachometerAlt} from 'react-icons/fa';

const Sidebar = () => {
    const [open, setOpen] = useState((JSON.parse(localStorage.getItem('hamburger_open'))));
    const handleSideClick = (open) =>{
        setOpen(!open)
        localStorage.setItem('hamburger_open', open)
    }
    if (open) {
        if(localStorage.getItem('role') === 'admin') {
            return (
                <div className="sidebar">
                    {/* <br /> */}
                    <ul>          
                        <li onClick={()=>setOpen(!open)}><FaTimes></FaTimes></li>
                        <li><Link to="/"><FaHome className='inline'></FaHome> Home </Link></li>
                        <li><Link to="You"><FaUser className='inline'></FaUser> Profile</Link></li>
                        <li><Link to="dashboard"><FaTachometerAlt className='inline'></FaTachometerAlt> Dashboard</Link></li>
                        <li><FaTable className='inline'></FaTable> Tables</li>{/*Dropdown*/}
                    </ul>
                </div>
            );
        }else if(localStorage.getItem('role') === 'scheduler') {
            return (
                <div className="sidebar">
                    {/* <br /> */}
                    <ul>          
                        {/* <br /> */}
                        <li onClick={()=>setOpen(!open)}><FaTimes></FaTimes></li>
                        <li><Link to="/"><FaHome className='inline'></FaHome> Home </Link></li>
                        <li><Link to="You"><FaUser className='inline'></FaUser> Profile</Link></li>
                        <li><FaPlus className='inline'></FaPlus> Add Constraints </li>{/*Dropdown*/}
                        <li><Link to="/institutionprofile"><FaUniversity className='inline'></FaUniversity> Institution</Link></li>
                        <li><FaPencilRuler className='inline'></FaPencilRuler> View/Edit Constraints</li>{/*Dropdown*/}
                        <li><Link to="/schedules"><FaTable className='inline'></FaTable> Schedules</Link></li>
                        <li><Link to="/schedules"><FaBell className='inline'></FaBell> Notifications(Coming Soon)</Link></li>

                    </ul>
                </div>
            );
            
        }else if(localStorage.getItem('role') === 'instructor') {
            return (
                <div className="sidebar">
                    {/* <br /> */}
                    <ul>          
                        <li onClick={()=>setOpen(!open)}><FaTimes></FaTimes></li>
                        <li><Link to="/"><FaHome className='inline'></FaHome> Home </Link></li>
                        <li><Link to="You"><FaUser className='inline'></FaUser> Profile</Link></li>
                        <li><Link to="/institutionprofile"><FaUniversity className='inline'></FaUniversity> Institution</Link></li>
                        <li><Link to="/schedules"><FaTable className='inline'></FaTable> Schedules</Link></li>
                        <li><Link to="/notifications"><FaBell className='inline'></FaBell> Notifications(Coming Soon)</Link></li>
                    </ul>
                </div>
            );
        }
    }else{
        return (
            <div className="hamburger centerholder" onClick={() => setOpen(!open)}>
                <FaBars></FaBars>
            </div>
        );
    }
}

export default Sidebar;
