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
        return true;   
    } catch (error) {
        console.log(error);
        return `Error-${error}`
    }
}

