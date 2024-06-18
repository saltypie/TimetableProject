import React, { useState } from 'react';
import './Login.css';
import Navbar from './navigation.jsx';
import axios from "axios";
import AdminSidebar from './adminSidebar.jsx';

const AddClass = () => {
  
  const [aclass, setClass] = useState('');
  const [capacity, setCapacity] = useState('');
  const [errorMessage, setErrorMessage] = useState('');


  const handleCapacityChange = (e) => {
    setCapacity(e.target.value);
  }
  const handleClassChange = (e) => {
    setClass(e.target.value);
  }



  const submit = async e => {
    e.preventDefault();
    const body = {
          alass: aclass,
          capacity: capacity
         };
    // Create the POST requuest
    try {
       const {data} = await                                                                            
                      axios.post('http://127.0.0.1:8000/timeapp/api//', body ,{headers: {'Content-Type': 'application/json'}}, {withCredentials: true});
        if(data.Message){
          alert(data["Message"]);
          setErrorMessage(data.Message);
        }else{
          window.location.href = '/class/';
        }
    } catch (error) {
       setErrorMessage("Incorrect Details");
    }
       
 }  

  return (
    <div>
      <Navbar title="Home" isLoggedIn={localStorage.getItem('isLogged')} fname={localStorage.getItem('fname')} />
      
      <AdminSidebar />
      <div className='wrapper'>
        <form action="" onSubmit={submit}>
          <h1>Add Class</h1>
          <div className="input-box">
            <input 
              name="aclass"
              type="text" 
              placeholder="Class Name" 
              value={aclass} 
              onChange={handleClassChange} 
              required 
            />
            <span className="info" title="This is the name given to the class.">ℹ️</span>
          </div>

          <div className="input-box">
            <input name="Capacity" value={capacity} onChange={handleCapacityChange} type="number" placeholder="Capacity" required />
          </div>

          <button type="submit" >Add</button>

          <div className="warning centerholder">
                  {errorMessage}
          </div>
        </form>    
      </div>
    </div>
  );
}

export default AddClass;
