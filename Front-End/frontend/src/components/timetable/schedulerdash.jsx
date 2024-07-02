import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { searchFunction } from '../reusable/functions';
import Navbar from '../navigation';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const TimetableVotesChart = () => {
    const [votesData, setVotesData] = useState({});

    useEffect(() => {
        fetchVotesData();
    }, []);

    const fetchVotesData = async () => {
        try {
            const data = await searchFunction('viewsets/timetables/by_vote');
            setVotesData(data);
        } catch (error) {
            console.error('Error fetching votes data:', error);
        }
    };

    const chartData = {
        labels: Object.keys(votesData),
        datasets: [
            {
                label: 'Number of Votes',
                data: Object.values(votesData),
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Timetable Votes',
            },
        },
    };

    return (
        <>  <Navbar title="Home"/>
            <div 
            className='rounded-sm border border-stroke bg-white py-6 px-7.5 shadow-default dark:border-strokedark dark:bg-boxdark'
            >
                <h2 className='text-title-md2 font-semibold text-primary dark:text-white centerholder'>Timetables By Votes</h2>
                <hr className='mb-2 mt-2'/>
                <Bar data={chartData} options={options} />
            </div>
        </>
    );
};

export default TimetableVotesChart;