import { BrowserRouter, Routes, Route, redirect, Navigate, useNavigate, Router, useNavigation } from 'react-router-dom'
import { Signin } from './pages/users-panel/Signin'
import { Signup } from './pages/users-panel/Signup'
// import { Dashboard } from './pages/Dashboard'
// import { SendMoney } from './pages/SendMony'
import axios from 'axios'
import "./App.css";
import { useEffect, useState } from 'react'
import { backendDown, navState } from './pages/atom'
import { useRecoilState } from 'recoil'  
import  Users  from './pages/users-panel/Users';
import Doctor from './pages/doctors panel/doctor-panel';


function App() {
  const [logged, setLogged] = useRecoilState(navState)
  
  const [isloading, setIsloading] = useState(true)
  const [isbackendDown,setIsbackDown] = useRecoilState(backendDown) 

  return (
    <div>
          {/* <PdfComp/> */} 
      <BrowserRouter>
        <Routes>
          {/* <Route path='/backendDown' element={<BackendDown/>}></Route> */}
          {/* <Route path='/' element={isbackendDown?<BackendDown/>:isloading?<Loader/>:<Navigate to='/signin' />}></Route>  */}
          <Route path='/users//*' element={<Users />}></Route>
          <Route path='doctors//*' element={<Doctor />}></Route>
          
          {/* <Route path='/dashboard' element={isbackendDown?<BackendDown/>:logged ? <Dashboard /> : <Navigate to='/signin' />}></Route> */}
        </Routes>
      </BrowserRouter>
    </div>
  )
} 

export default App
