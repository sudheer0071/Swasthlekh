import { BrowserRouter, Routes, Route, redirect, Navigate, useNavigate, Router, useNavigation } from 'react-router-dom'
import { Signin } from './Signin'
import { Signup } from './Signup'
// import { Dashboard } from './pages/Dashboard'
// import { SendMoney } from './pages/SendMony'
import axios from 'axios' 
import { useEffect, useState } from 'react'
import { backendDown, navState } from '../atom'
import { useRecoilState } from 'recoil'
import { BACKEND_URL } from '../config'
import { HashLoader } from 'react-spinners'  

import { Home } from './Home';
import { View } from './View'; 
import { Upload } from '../../components/Upload';

function Users() {
  const [logged, setLogged] = useRecoilState(navState)
  
  const [isloading, setIsloading] = useState(true)
  const [isbackendDown,setIsbackDown] = useRecoilState(backendDown) 

  return (
    <div>
          {/* <PdfComp/> */}   
        <Routes>
          {/* <Route path='/backendDown' element={<BackendDown/>}></Route> */}
          {/* <Route path='/' element={isbackendDown?<BackendDown/>:isloading?<Loader/>:<Navigate to='/signin' />}></Route> */}
          <Route path='/mainpage' element={<Upload />}></Route> 
          <Route path='/view' element={<View />}></Route> 
          <Route path='/home' element={<Home />}></Route> 
          <Route path='/signup' element={<Signup />}></Route> 
          {/* <Route path='/send' element={<SendMoney />}></Route> */}
          <Route path='/signin' element={<Signin />}></Route> 
          
          {/* <Route path='/dashboard' element={isbackendDown?<BackendDown/>:logged ? <Dashboard /> : <Navigate to='/signin' />}></Route> */}
        </Routes> 
    </div>
  )
} 

export default Users
