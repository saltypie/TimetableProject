import {useEffect, useState} from "react"
import axios from "axios";
const Logout = () => {
    const logoutProcess = () => {
        try {
        //  const {data} = await  
        //        axios.post('http://localhost:8000/logout/',{
        //        refresh_token:localStorage.getItem('refresh_token')
        //        } ,{headers: {'Content-Type': 'application/json'}},  
        //        {withCredentials: true});
    
            localStorage.clear();
        //  axios.defaults.headers.common['Authorization'] = null;
          window.location.href = '/login'
        } catch (e) {
            console.log('logout not working', e)
            alert("Error loggin out. Please try again.")
            window.location.href = "/Logout"
        }
      
    }
    setTimeout(logoutProcess, 3000);

    return (
       <div>
          You will be logged out shortly...
       </div>
     )
}
export default Logout;