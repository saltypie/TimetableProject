import React, { useState, useEffect } from 'react';
import { searchFunction, generalPost } from '../reusable/functions';

const CommentComponent = ({ scheduleId }) => {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');

    useEffect(() => {
        fetchComments();
    }, [scheduleId]);

    const fetchComments = async () => {
        try {
            const data = await searchFunction('viewsets/comments', { schedule: scheduleId });
            setComments(data);
        } catch (error) {
            console.error('Error fetching comments:', error);
        }
    };

    const handleSubmitComment = async (e) => {
        e.preventDefault();
        try {
            await generalPost('viewsets/comments', {
                content: newComment,
                schedule: scheduleId
            });
            setNewComment('');
            fetchComments();
        } catch (error) {
            console.error('Error posting comment:', error);
        }
    };

    return (
        <div className="comments-container">
            <div className="centerholder">
                <div>
                    <h3 className="text-title-md2 font-semibold text-primary dark:text-white">Comments</h3>
                    <form onSubmit={handleSubmitComment} className="new-comment-form">
                        <textarea
                            className='w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary'
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Write a comment..."
                            required
                        /><br/>
                        <button type="submit"
                            className="inline-flex items-center justify-center bg-primary py-4 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
                        >
                            Post Comment
                        </button>
                    </form>       
                </div>
            </div>
            <div className="comments-list">
                {comments.map((comment) => (
                    <div key={comment.id} className="cshadow-md rounded-lg p-4 break-words bg-white mb-2">
                        <p>{comment.content}</p>
                        <small 
                            onClick={() => window.location = `mailto:${comment.commenter_details.email}`}
                            className="cursor-pointer underline"
                        >
                            By {comment.commenter_details.fname} {comment.commenter_details.lname} on {new Date(comment.time).toLocaleString()}
                        </small>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CommentComponent;