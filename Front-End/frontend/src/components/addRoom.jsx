import React, { useState } from 'react';
import './Login.css';
import Navbar from './navigation.jsx';
import axios from "axios";
import Sidebar from './navigation/sidebar.jsx';
import { generalPost } from './reusable/functions.jsx';

const AddSubject = () => {
  
  const [room, setRoom] = useState('');
  const [capacity, setCapacity] = useState(1);
  const [errorMessage, setErrorMessage] = useState('');


  const handleCapacityChange = (e) => {
      setCapacity(e.target.value);
  }
  const handleRoomChange = (e) => {
    setRoom(e.target.value);
  }



  const submit = async e => {
    e.preventDefault();
    if(capacity<0){
      setErrorMessage("Capacity can not be 0 or less.")
      return
    }
    const body = {
          r_number: room,
          seating_capacity: capacity
         };
    // Create the POST request

    generalPost('viewsets/rooms', body).then((response) =>{
      if(!response){
        setErrorMessage("Room with that code exists")
      }else{
        alert("Room Added Successfuly");
      }
    }
    ).catch((error) => {
      console.error('There was an error!', error);
      setErrorMessage("Invalid Details");
    });
       
 }  

  return (
    <div>
      <Navbar title="Home" isLoggedIn={localStorage.getItem('isLogged')} fname={localStorage.getItem('fname')} />
            <div className='wrapper'>
        <form action="" onSubmit={submit}>
          <h1>Add Room</h1>
          <div className="input-box">
            <input 
              name="room"
              type="text" 
              placeholder="Room Number/Code/Name" 
              value={room} 
              onChange={handleRoomChange} 
              required 
            />
            <span className="info" title="This is the name/code given to the room.">ℹ️</span>
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

export default AddSubject;
