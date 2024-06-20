// ProfileUpdateForm.js

import React, { useEffect, useState } from 'react';
import './Login.css';
import axios from 'axios';
import Navbar from './navigation';
const ProfileUpdateForm = () => {
    const [bio, setBio] = useState('');
    const [secondEmail, setSecondEmail] = useState('');
    const [photo, setPhoto] = useState(null);
    const [photoView, setPhotoView] = useState(null);
    const fetchProfile = async () => {
        try {
            const response = await axios.get('http://localhost:8000/timeapp/api/viewsets/profile/',{
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                }
            })
            const profile = response.data[0]
            if (profile){
                setPhotoView(profile.photo_url)
                setSecondEmail(profile.second_email)
                setBio(profile.bio)
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchProfile()
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('bio', bio);
        // formData.append('second_email', secondEmail);
        if (photo) {
            formData.append('photo_url', photo);
        }
        if (secondEmail) {
            formData.append('second_email', secondEmail);
        }

        try {
            const response = await axios.patch('http://localhost:8000/timeapp/api/profileupdate/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                }
            });
            console.log('Profile updated', response.data);
            window.location.href = '/You';
        } catch (error) {
            console.error('Error updating profile', error);
            alert('Error updating profile try again');
        }
    };

    return (
        <div><Navbar title="Home" />
        <br /><br />
            <div className="wrapper">
                <form onSubmit={handleSubmit}>
                    <div className="centerholder">
                        {photoView && (<img className="profilePic" src={photoView} alt="Profile" />)}
                        <h1 className='profileName'>{localStorage.getItem('fname') ? localStorage.getItem('fname') : 'Super Admin'}'s Profile</h1>
                    </div>
                    <div className='input-box'>
                        <label htmlFor="bio">Bio:</label>
                        <input
                            type="text"
                            id="bio"
                            placeholder='Add a bio about yourself'
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                        />
                    </div>
                    <div className='input-box'>
                        <label htmlFor="secondEmail">Second Email:</label>
                        <input
                            type="email"
                            id="secondEmail"
                            placeholder='Enter your second email'
                            value={secondEmail}
                            onChange={(e) => setSecondEmail(e.target.value)}
                        />
                    </div>
                    <br/>
                    <div >
                        <label htmlFor="photo">Change Profile Picture:</label>
                        <input className='form-control custom-file'
                            type="file"
                            id="photo"
                            onChange={(e) => setPhoto(e.target.files[0])}
                        />
                    </div>
                    <br/>
                    <button type="submit">Update Profile</button>
                </form>
            </div>
        </div>
    );
};

export default ProfileUpdateForm;
