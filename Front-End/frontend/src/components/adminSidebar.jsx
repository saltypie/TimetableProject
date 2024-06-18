import React from 'react';
import './AdminSidebar.css';
import { Link } from 'react-router-dom';
const AdminSidebar = () => {
    return (
        <div className="sidebar">
            <ul>
                <li><Link to="/Admin">Dashboard</Link></li>
                <li><a href="#">Lecturers</a></li>
                <li><Link to="/Class">Classes</Link></li>
                <li><a href="#">Timetables</a></li>
            </ul>
        </div>
    );
}

export default AdminSidebar;
