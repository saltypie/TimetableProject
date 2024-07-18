
import React, { useEffect, useState } from 'react';
import './Login.css';
import axios from 'axios';
import Navbar from './navigation';

const Profile = () => {
    const [bio, setBio] = useState('');
    const [secondEmail, setSecondEmail] = useState('');
    const [photo, setPhoto] = useState(null);
    const [photoView, setPhotoView] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null); // State for preview image URL

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

    // Function to handle file change and preview
    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        setPhoto(file);

        const reader = new FileReader();
        reader.onload = () => {
            setPreviewUrl(reader.result);
        };
        reader.readAsDataURL(file);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('bio', bio);
        formData.append('second_email', secondEmail);
        if (photo) {
            formData.append('photo_url', photo);
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
        }
    };

    return (
        <div>
            <Navbar title="Home" />
            <br /><br />
            <div className="wrapper">
                <form onSubmit={handleSubmit}>
                    <div className="centerholder text-black">
                        {previewUrl ? (
                            <img className="profilePic" src={previewUrl} alt="Profile" />
                        ) : (
                            <img className="profilePic" src={photoView} alt="Current Profile" />
                        )}
                        <h1 className='profileName'>{localStorage.getItem('fname') ? localStorage.getItem('fname') : 'Super Admin'}'s Profile</h1>
                    </div>
                    <div className='input-box'>
                        <label htmlFor="bio">Bio:</label>
                        <input
                            type="text"
                            id="bio"
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                        />
                    </div>
                    <div className='input-box'>
                        <label htmlFor="secondEmail">Second Email:</label>
                        <input
                            type="email"
                            id="secondEmail"
                            value={secondEmail}
                            onChange={(e) => setSecondEmail(e.target.value)}
                        />
                    </div>
                    <br />
                    <div>
                        <label htmlFor="photo">Change Profile Picture:</label>
                        <input className='form-control custom-file'
                            type="file"
                            id="photo"
                            onChange={handlePhotoChange}
                        />
                    </div>
                    <br />
                    <button type="submit">Update Profile</button>
                </form>
            </div>
        </div>
    );
};

export default Profile;
