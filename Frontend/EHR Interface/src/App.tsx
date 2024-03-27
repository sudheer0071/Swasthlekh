import { BrowserRouter, Routes, Route, redirect, Navigate, useNavigate, Router, useNavigation } from 'react-router-dom'
import { Signin } from './pages/Signin'
import { Signup } from './pages/Signup'
// import { Dashboard } from './pages/Dashboard'
// import { SendMoney } from './pages/SendMony'
import axios from 'axios'
import "./App.css";
import { useEffect, useState } from 'react'
import { backendDown, navState } from './atom'
import { useRecoilState } from 'recoil'
import { BACKEND_URL } from './config'
import { HashLoader } from 'react-spinners' 
import { Upload } from './pages/Upload' 
import { Home } from './pages/Home';
function App() {
  const [logged, setLogged] = useRecoilState(navState)
  
  const [isloading, setIsloading] = useState(true)
  const [isbackendDown,setIsbackDown] = useRecoilState(backendDown) 

  return (
    <div>
      <BrowserRouter>
        <Routes>
          {/* <Route path='/backendDown' element={<BackendDown/>}></Route> */}
          {/* <Route path='/' element={isbackendDown?<BackendDown/>:isloading?<Loader/>:<Navigate to='/signin' />}></Route> */}
          <Route path='/mainpage' element={<Upload />}></Route> 
          <Route path='/home' element={<Home />}></Route> 
          <Route path='/signup' element={<Signup />}></Route> 
          {/* <Route path='/send' element={<SendMoney />}></Route> */}
          <Route path='/signin' element={<Signin />}></Route>
          {/* <Route path='/dashboard' element={isbackendDown?<BackendDown/>:logged ? <Dashboard /> : <Navigate to='/signin' />}></Route> */}
        </Routes>
      </BrowserRouter>
    </div>
  )
} 

export default App
