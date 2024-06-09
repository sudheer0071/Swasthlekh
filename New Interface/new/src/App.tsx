import { BrowserRouter, Routes, Route } from 'react-router-dom'

// import { Signin } from './pages/users-panel/Signin'
// import { Signup } from './pages/users-panel/Signup'
// import { Dashboard } from './pages/Dashboard'
// import { SendMoney } from './pages/SendMony'
// import axios from 'axios'
import "./App.css";
// import { useEffect, useState } from 'react'
// import { backendDown, navState } from './pages/atom'
// import { useRecoilState } from 'recoil'  
import  Users  from './pages/users-panel/Users';
import Doctor from './pages/doctors panel/doctor-panel';
// import { Button } from './components/Button';
import { Rouute } from './Rouute';  
import { Portal } from './pages/users-panel/Portal';
import { DoctorPortal } from './pages/doctors panel/Portal';
import { Privacy } from './pages/Privacy';
import { GoogleOAuthProvider } from '@react-oauth/google'; 

function App() {
  // const [logged, setLogged] = useRecoilState(navState);
  // const [isloading, setIsloading] = useState(true);
  // const [isbackendDown, setIsbackDown] = useRecoilState(backendDown); 
  const clientId = import.meta.env.VITE_CLIENT_ID
  console.log("client id: ");
  
  console.log(clientId);
  
  return (
    <div>
      {/* <div className='flex h-screen'>
      <SideBar name={'john'}/>
      </div> */}
       {/* <h1 className="flex justify-center text-slate-700 font-bold -mt-6">Swasthलेख</h1> */}
      <div className=''> 
      <GoogleOAuthProvider clientId={clientId}> 
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Rouute/>} ></Route>
          <Route path='/privacy-policy' element={<Privacy/>} ></Route> 
          <Route path='/user/portal//*' element={<Portal/>} ></Route>
          <Route path='/doctor/portal//*' element={<DoctorPortal/>} ></Route>
          <Route path="/users//*" element={<Users />} />
          <Route path="/doctors//*" element={<Doctor />} />
        </Routes>
      </BrowserRouter>
          </GoogleOAuthProvider>
      </div>
    </div>
  );
} 

export default App
