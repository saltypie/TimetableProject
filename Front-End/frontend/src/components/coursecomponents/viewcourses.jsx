// courseTable.js

import React, { useEffect, useState } from 'react';
import '../Login.css';
import axios from 'axios';
import Navbar from '../navigation';
const CourseTable = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [courses, setCourses] = useState([]);

    const fetchData= async () => {
        try {
            const response = await axios.get('http://localhost:8000/timeapp/api/viewsets/courses/',{
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                },
                params: {
                    'search': searchQuery,
                    // 'instution': localStorage.getItem('institution')
                }
            })
            const courses = response.data
            if (courses){
                setCourses(courses)
                console.log(courses)
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchData();
    }, [])



    return (
        <div><Navbar title="Home" />
            <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
            <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">
                Top Channels
            </h4>

            <div className="flex flex-col">
                <div className="grid grid-cols-3 rounded-sm bg-gray-2 dark:bg-meta-4 sm:grid-cols-5">
                <div className="p-2.5 xl:p-5">
                    <h5 className="text-sm font-medium uppercase xsm:text-base">
                    Number
                    </h5>
                </div>
                <div className="p-2.5 text-center xl:p-5">
                    <h5 className="text-sm font-medium uppercase xsm:text-base">
                    Name
                    </h5>
                </div>
                <div className="p-2.5 text-center xl:p-5">
                    <h5 className="text-sm font-medium uppercase xsm:text-base">
                    Capacity
                    </h5>
                </div>
                <div className="hidden p-2.5 text-center sm:block xl:p-5">
                    <h5 className="text-sm font-medium uppercase xsm:text-base">
                    Instructors
                    </h5>
                </div>
                <div className="hidden p-2.5 text-center sm:block xl:p-5">
                    <h5 className="text-sm font-medium uppercase xsm:text-base">
                    Conversion
                    </h5>
                </div>
                </div>

                {courses.map((course, key) => (
                <div
                    className={`grid grid-cols-3 sm:grid-cols-5 ${
                    key === courses.length - 1
                        ? ''
                        : 'border-b border-stroke dark:border-strokedark'
                    }`}
                    key={key}
                >

                    <div className="flex items-center justify-center p-2.5 xl:p-5">
                    <p className="text-black dark:text-white">{course.course_number}</p>
                    </div>
                    <div className="flex items-center justify-center p-2.5 xl:p-5">
                    <p className="text-black dark:text-white">{course.course_name}</p>
                    </div>

                    <div className="flex items-center justify-center p-2.5 xl:p-5">
                    <p className="text-meta-3">${course.max_numb_students}</p>
                    </div>

                    <div className="hidden items-center justify-center p-2.5 sm:flex xl:p-5">
                    <p className="text-black dark:text-white">{course.sales}</p>
                    </div>

                    <div className="hidden items-center justify-center p-2.5 sm:flex xl:p-5">
                    <p className="text-meta-5">View Instructors</p>
                    </div>
                </div>
                ))}
            </div>
            </div>       
        </div>
    );
};

export default CourseTable;
