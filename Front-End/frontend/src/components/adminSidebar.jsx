import React from 'react';
import './AdminSidebar.css';
import { Link } from 'react-router-dom';
const AdminSidebar = () => {
    return (
        <div className="sidebar">
            <ul>
                <li><Link to="/Admin">Dashboard</Link></li>
                <li><a href="/AddTiming">Timings</a></li>
                <li><Link to="/AddRoom">Rooms</Link></li>
                <li><Link to="/AddSubject">Subjects</Link></li>
                <li><Link to="/AddCourse">Courses</Link></li>
                <li><Link to="/AddSection">Sections</Link></li>
                <li><a href="#">Timetables</a></li>
                <li><Link to="/CommentSection">Messages</Link></li>
            </ul>
        </div>
    );
}

export default AdminSidebar;
