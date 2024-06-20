import React, { useEffect, useState } from 'react';
import './Login.css';
import axios from 'axios';
import { FaKey, FaPen } from 'react-icons/fa';
import Navbar from './navigation';
import { Link } from 'react-router-dom';

const You = () => {
    const [profile, setProfile] = useState(null);

    const fetchProfile = async () => {
        try {
            const response = await axios.get('http://localhost:8000/timeapp/api/viewsets/profile/', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                }
            });
            console.log('API Response:', response.data); // Log the entire response

            if (response.data.length > 0) { // Check if data is an array and not empty
                const profile = response.data[0];
                setProfile(profile);
            } else {
                console.warn('No profile data found');
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    return (
        <div>
            <Navbar title="Home" />
            <div className="not-a-wrapper">
                <div className="wide-div">
                    <h1 className='centerholder'>You</h1>
                    <br />
                    <div className="centerholder">
                        {profile && profile.photo_url && (
                            <img className="profilePic" src={profile.photo_url} alt="Profile" />
                        )}
                        <div>
                            <h2 className=''>
                                First Name: {localStorage.getItem('fname') ? localStorage.getItem('fname') : 'Admin'}
                            </h2>
                            <h3 className=''>
                                Email: {localStorage.getItem('email')}
                            </h3>
                        </div>
                    </div>
                    <br />
                    <div className='white-div'>
                        <Link to="/ProfileUpdate">                    
                            Edit Profile
                            <FaPen className='icon' />
                        </Link>
                    </div>
                    <br />
                    <div className='white-div'>
                        <Link to="/ChangePassword">                    
                            Change Password
                            <FaKey className='icon' />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default You;
