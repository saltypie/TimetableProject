
import Signup from './components/signup.jsx';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Login from "./components/Login.jsx";
import Logout from "./components/Logout.jsx";
import Lock from "./components/lock.jsx";
import LandingPage from "./components/landingpage.jsx";
import Activate from "./components/Activate.jsx";
import Home from "./components/home.jsx";
import ResetPassword from "./components/resetPassword.jsx";
import Email from "./components/email.jsx";
import Admin from "./components/admin.jsx";
import Class from "./components/class.jsx";
import AddRoom from "./components/addRoom.jsx";
import EditClass from "./components/editRoom.jsx";
import ViewClass from "./components/viewClass.jsx";
import ProfileUpdateForm from './components/ProfileForm.jsx';
import ChangePassword from './components/changePassword.jsx';
import You from './components/You.jsx';
import Profile from "./components/profile.jsx";
import AddTiming from "./components/addTiming.jsx";
import AddSubject from "./components/addSubject.jsx";
import AddCourse from "./components/addCourse.jsx";
import AddSection from "./components/addSection.jsx";
import CourseTable from './components/coursecomponents/viewcourses.jsx';
import RoomTable from './components/coursecomponents/viewrooms.jsx';
import DepartmentTable from './components/coursecomponents/viewdepartments.jsx';
import StreamTable from './components/coursecomponents/viewstreams.jsx';
import TimingTable from "./components/coursecomponents/viewtimings.jsx";
import Dash from "./components/admincomponents/dashboard.jsx"
import InstitutionProfile from './components/institution.jsx';
import CommentSection from './components/CommentSection.jsx';
import './css/style.css';

// import './css/satoshi.css';


/*import Sidebar from './navigation/sidebar.jsx'; */

import{useEffect, useState} from 'react';
import Sidebar from './components/navigation/sidebar.jsx';
import Timetables from './components/timetable/timetables.jsx';
import Timetable from './components/timetable/lessons.jsx';

function App() {
  const[loggedIn,setLoggedIn]=useState(true);

  const checkForInactivity= () => {

    const expireTime=localStorage.getItem("expireTime");

    if(expireTime<Date.now()){
      console.log("Locked")
      setLoggedIn(false);
    }
  }
const updateExpireTime=()=>{
  const expireTime=Date.now()+20000;
  localStorage.setItem("expireTime",expireTime);
}
useEffect(()=>{
  
  const interval=setInterval(()=>{
    checkForInactivity();
  }, 10000);
  return()=>clearInterval(interval);
}, []);

useEffect(()=>{
  updateExpireTime();

  window.addEventListener("click",updateExpireTime);
  window.addEventListener("keypress",updateExpireTime);
  window.addEventListener("scroll",updateExpireTime);
  window.addEventListener("mousemove",updateExpireTime);

  return()=>{
    window.removeEventListener("click",updateExpireTime);
  window.removeEventListener("keypress",updateExpireTime);
  window.removeEventListener("scroll",updateExpireTime);
  window.removeEventListener("mousemove",updateExpireTime);
  }
}, []);
  return (
    <div >

     <BrowserRouter>
        <Sidebar/>
        <Routes>
          <Route path="/email" element={<Email/>}/>
          <Route path="/ResetPassword/:id" element={<ResetPassword/>}/>
          <Route path="/" element={<Home/>}/>
          <Route path="/Activate" element={<Activate/>}/>
          <Route path="/LandingPage" element={<LandingPage/>}/>
          <Route path="/Logout" element={<Logout/>}/>
          <Route path="/Login" element={<Login/>}/>
          <Route path="/SignUp" element={<Signup/>}/>
          <Route path="/Lock" element={<Lock/>}/>
          <Route path="/Admin" element={<Admin/>}/>
          <Route path="/Class" element={<Class/>}/>
          <Route path="/AddRoom" element={<AddRoom/>}/>
          <Route path="/EditClass" element={<EditClass/>}/>
          <Route path="/ViewClass" element={<ViewClass/>}/>
          <Route path="/ProfileUpdate" element={<ProfileUpdateForm/>}/>
          <Route path="/You" element={<You/>}/>
          <Route path="/Profile" element={<Profile/>}/>
          <Route path="/AddTiming" element={<AddTiming/>}/>
          <Route path="/AddCourse" element={<AddSubject/>}/>
          <Route path="/AddDepartment" element={<AddCourse/>}/>
          <Route path="/AddSection" element={<AddSection/>}/>
          <Route path="/Course" element={<CourseTable/>}/>
          <Route path="/Timing" element={<TimingTable/>}/>
          <Route path="/Room" element={<RoomTable/>}/>
          <Route path="/Department" element={<DepartmentTable/>}/>
          <Route path="/Stream" element={<StreamTable/>}/>
          <Route path='/dashboard' element={<Dash/>}/>
          <Route path='/institutionprofile' element={<InstitutionProfile/>}/>
          <Route path='/schedules' element={<Timetables/>}/>
          <Route path='/lessons/:timetableId' element={<Timetable/>}/>
          <Route path='/CommentSection' element={<CommentSection/>}/>
          <Route path='/changepassword' element={<ChangePassword/>}/>
        </Routes>
      </BrowserRouter>

    </div>
  );
}

export default App;
