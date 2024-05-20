import React from 'react';
import './Login.css';
import { FaLock } from "react-icons/fa";



const Activate = () => {
  return (
    <div className= 'wrapper'>
        <form action="">
            <h1>Activation</h1>

            <h3>Enter the code sent to you to Activate your account</h3>

             <div className="input-box">
                <input type="text" placeholder="Code" required />
                <FaLock className='icon'/>
             </div>
             
             <button type="submit" onclick="">Activate</button>
        </form>    
    </div>
  )
}

export default Activate