import React, { useEffect, useState } from 'react';
import '../Login.css';
import axios from 'axios';

export const searchFunction = async (endpoint,inputParams) => {

    try {
        endpoint = endpoint.replace(/(^\/+|\/+$)/g, '');
        const response = await axios.get(`http://localhost:8000/timeapp/api/${endpoint}/`,{
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('access_token')}`
            },
            params: inputParams
        })
        const responseData = response.data;

        let wasVisitCreated = await createVisit(endpoint, "Read");
        console.log(wasVisitCreated)

        return responseData;

    } catch (error) {
        console.log(error);
        return `Error-${error}`
    }
}

export const generalPatch = async (endpoint,id,data) => {
    try {
        endpoint = endpoint.replace(/(^\/+|\/+$)/g, '');
        await axios.patch(`http://localhost:8000/timeapp/api/${endpoint}/${id}/`, data, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
            }
        }); 

        let wasVisitCreated = await createVisit(endpoint, "Update");
        console.log(wasVisitCreated)

        return true;   
    } catch (error) {
        console.log(error);
        return `Error-${error}`
    }
}
export const generalPost = async (endpoint,data) => {
    try {
        endpoint = endpoint.replace(/(^\/+|\/+$)/g, '');
        await axios.post(`http://localhost:8000/timeapp/api/${endpoint}/`, data, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
                'Content-Type': 'application/json'
            }
        });
        
        let wasVisitCreated = await createVisit(endpoint, "Create");
        console.log(wasVisitCreated)        

        return true;   
    } catch (error) {
        console.log(error);
        return false;
    }
}

export const generalDelete = async (endpoint,id) => {
    try {
        endpoint = endpoint.replace(/(^\/+|\/+$)/g, '');
        await axios.delete(`http://localhost:8000/timeapp/api/${endpoint}/${id}/`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('access_token')}`
            }
        }); 

        let wasVisitCreated = await createVisit(endpoint, "Delete");
        console.log(wasVisitCreated)

        return true;   
    } catch (error) {
        console.log(error);
        return `Error-${error}`
    }
}

const createVisit = async (endpoint, action) => {
    try {
        let returnBool = false;
        const table_name = tableName(endpoint);
        if(!table_name || table_name==="Unknown"){
            console.log("Table name was not of concern")
            return false;
        }
        const data = {
            table_name: table_name,
            action: action
        }
        const response = await axios.post('http://localhost:8000/timeapp/api/viewsets/visits/', data, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
                'Content-Type': 'application/json'
            }
        });
        response.data ? returnBool = true : returnBool = false;
        return returnBool
    } catch (error) {
        console.log(error);
        console.log("Error creating visit")
        return false;
    }
}

function tableName(endpoint) {
    endpoint = endpoint.replace(/(^\/+|\/+$)/g, '');
    let endpoint_arr = endpoint.split("/")

    if (endpoint_arr.includes("institutions")) {
        return "Institution";
    } else if (endpoint_arr.includes("meetingtimes")) {
        return "MeetingTime";
    } else if (endpoint_arr.includes("streams")) {
        return "Stream";
    } else if (endpoint_arr.includes("rooms")) {
        return "Room";
    } else if (endpoint_arr.includes("roles")) {
        return "Role";
    } else if (endpoint_arr.includes("courses")) {
        return "Course";
    } else if (endpoint_arr.includes("profile")) {
        return "Profile";
    } else if (endpoint_arr.includes("departments")) {
        return "Department";
    } else if (endpoint_arr.includes("lessondetails")) {
        return "Lesson";
    } else if (endpoint_arr.includes("timetables")) {
        return "Timetable";
    } else {
        return "Unknown"; // or handle default case as needed
    }
}



export const fetchVisitData = async (endpoint) => {
  try {
    const response = await axios.get(`http://localhost:8000/timeapp/api/viewsets/visits/${endpoint}/`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching visit data:', error);
    return null;
  }
};