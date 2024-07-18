import React, { useState, useEffect } from 'react';
import { FaThumbsUp, FaThumbsDown } from 'react-icons/fa';
import { generalPost, searchFunction } from '../reusable/functions';

const VoteComponent = ({ scheduleId }) => {
    const [voteDetails, setVoteDetails] = useState({});

    const handleVoteClick = async (type) => {
        try {
            const value = type === 'up' ? 1 : -1;
            await generalPost('viewsets/votes/takevote', {
                schedule: scheduleId, 
                voter: localStorage.getItem('user_id'), 
                value: value
            });
            fetchTally();
        } catch (error) {
            console.error('Error voting:', error);
        }
    };

    const fetchTally = async () => {
        try {
            const data = await searchFunction('viewsets/votes/tally', { search: scheduleId });
            setVoteDetails(data);
        } catch (error) {
            console.error('Error fetching tally:', error);
        }
    };

    useEffect(() => {
        fetchTally();
    }, [scheduleId]);

    return (
        <div className="rounded-sm border border-stroke bg-white py-4 px-4 shadow-default dark:border-strokedark dark:bg-boxdark centerholder">
            <button 
                className="inline-flex items-center justify-center bg-primary py-4 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10" 
                onClick={() => handleVoteClick('up')}
            >
                <FaThumbsUp className={voteDetails.voters_value === 1 ? "text-black" : "text-white"} />
            </button>
            <div className="rounded-sm border border-stroke bg-white py-3 px-7.5 shadow-default dark:border-strokedark dark:bg-boxdark">
                {voteDetails.tally}
            </div>
            <button 
                className="inline-flex items-center justify-center bg-primary py-4 px-10 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10" 
                onClick={() => handleVoteClick('down')}
            >
                <FaThumbsDown className={voteDetails.voters_value === -1 ? "text-black" : "text-white"} />
            </button>
        </div>
    );
};

export default VoteComponent;