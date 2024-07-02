import React,{ useEffect, useState } from "react";
import Navbar from "./navigation";
import { fomartDateTime, generalPost, searchFunction } from './reusable/functions.jsx';

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [errorMsg, setErrorMsg] = useState('');
    const fetchNotifications = async () => {
        searchFunction('viewsets/notifications').then((data) => {
            if (data.length===0) {
                setErrorMsg("No notifications yet");
                return;
            }
            console.log(data)
            setNotifications(data);
        }).catch((error) => {
            console.log(error)
        })
    }
    const markAsRead = async (id) => {
        try {
            searchFunction(`viewsets/notifications/mark_read`).then((data) => {
                fetchNotifications();
            }).catch((error) => {
                console.log(error)
                setErrorMsg("unable to mark as read");
            })
        } catch (error) {
            setErrorMsg(error);
        }
    }

    useEffect(() => {
        fetchNotifications();
        markAsRead();
    }, []);

    return (
        <><Navbar title="Home"/>
            <div className="min-h-[50vh] min-w-[76vw] rounded-sm border border-stroke bg-white py-6 px-7.5 shadow-default dark:border-strokedark dark:bg-boxdark">
                <h1 className="text-title-md2 font-semibold text-primary dark:text-white centerholder">Notifications</h1>
                <hr className="mb-5"/>
                {errorMsg && <p className="text-red-500 centerholder">{errorMsg}</p>}
                <div className="justify-center">
                    <div>
                    {notifications.map((notification) => (
                        <div key={notification.id} className="w-[74vw] border border-gray-300 p-4 mb-4">
                            <p className="text-black-700 ">{notification.description}</p>
                            <span className="text-gray-500 text-sm justify-end">{fomartDateTime(notification.time)}</span>
                        </div>
                    ))}
                    </div>
                </div>
                    

            </div>
        </>
    );
};

export default Notifications;