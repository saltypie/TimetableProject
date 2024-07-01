import React, { useState, useEffect } from 'react';
import './Login.css';
import Navbar from './navigation.jsx';
import axios from "axios";

const CommentSection = ({ id }) => {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const response = await axios.get(`/api/`);
                setComments(response.data);
            } catch (error) {
                console.error('Error fetching comments:', error);
            }
        };

        fetchComments();
    }, [id]);

    const addComment = async () => {
        try {
            const response = await axios.post(`/api/`, {
                text: newComment,
            });
            setComments([...comments, response.data]); 
            setNewComment('');
            setErrorMessage('');
        } catch (error) {
            console.error('Error adding comment:', error);
            setErrorMessage('Failed to add comment. Please try again.');
        }
    };

    return (
        <div>
            <Navbar title="Home" isLoggedIn={localStorage.getItem('isLogged')} fname={localStorage.getItem('fname')} />
            <h2>Comments</h2>
            <ul>
                {comments.map(comment => (
                    <li key={comment.id}>{comment.text}</li>
                ))}
            </ul>
            <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add your comment..."
                required
            /><br />
            <button onClick={addComment}>Add Comment</button>
            {errorMessage && <p>{errorMessage}</p>}
        </div>
    );
};

export default CommentSection;
