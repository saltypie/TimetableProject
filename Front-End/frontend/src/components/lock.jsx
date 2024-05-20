import React from 'react';
import './Login.css';
import { FaLock } from "react-icons/fa";
import { Link } from 'react-router-dom';


const Lock = () => {
  return (
    <div className='wrapper'>
        <form action="">
            <h1>Locked</h1>

            <h3>Re-enter password to continue</h3>

             <div className="input-box">
                <input type="password" placeholder="Password" required />
                <FaLock className='icon'/>
             </div>
             
             <button type="submit" onclick="">Unlock</button>
        </form>    
    </div>
  )
}

export default Lock