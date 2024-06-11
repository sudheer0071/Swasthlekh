import { Routes, Route  } from 'react-router-dom' 
// import { Dashboard } from './pages/Dashboard'
// import { SendMoney } from './pages/SendMony' 
// import {  useState } from 'react'
// import { backendDown, navState } from '../atom'
// import { useRecoilState } from 'recoil'  
import { Home } from './Home';
import { View } from './View'; 
import { Upload } from '../../components/Upload';
import { Logs } from './Logs'
import { Requests } from './Requests';
import { SideBar } from '../../New-components/Sidebar'; 


function Users() {  
  
  // const [logged, setLogged] = useRecoilState(navState)
  
  // const [isloading, setIsloading] = useState(true)
  // const [isbackendDown,setIsbackDown] = useRecoilState(backendDown) 
// const [sign, SetSign] = useState(false) 
// useState(()=>{
//   const check = localStorage.getItem('sign')
//   if (check=='sign') {
//      SetSign(true)
//   }
// }) 

  return (
    <div>
    <div className=' flex'> 
    <div className=' fixed'>
      <SideBar user='' name={localStorage.getItem('fname')||''} email={localStorage.getItem('email')||''} />  
    </div>
          {/* <PdfComp/> */}    
          <div className=' ml-14 sm:ml-12 md:ml-14 lg:ml-72 flex-grow'>  
            
            <div className=" -z-10 relative ml-16 sm:ml-36 md:ml-6 lg:ml-96">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1175 263" fill="black" className="abs hero-backgroundImage top right primary-3"><path d="M470 96.1505C285.24 111.849 142.033 74.7745 0 0H1175V263C862.527 210.142 1128.96 40.1598 470 96.1505Z" fill="#831a4a"></path></svg>
          </div>  
          <div className=" py-7 sm:py-0 md:py-0 lg:py-0 -mt-20 sm:-mt-24 md:-mt-44 lg:mt-0 lg:hidden font-bold font-mono text-4xl md:text-5xl ml-1 ">
          <a href="/" className=' '>
        Swasth<p className=" inline text-pink-500">लेख</p>
          </a>
        </div> 
          <Routes> 
            {/* <Route path='/backendDown' element={<BackendDown/>}></Route> */}
            {/* <Route path='/' element={isbackendDown?<BackendDown/>:isloading?<Loader/>:<Navigate to='/signin' />}></Route> */}
            <Route path='/mainpage' element={<Upload />}></Route> 
            <Route path='/logs' element={<Logs />}></Route> 
            <Route path='/requests' element={<Requests />}></Route> 
            <Route path='/view' element={<View />}></Route> 
            <Route path='/home' element={<Home />}></Route> 
            {/* <Route path='/dashboard' element={isbackendDown?<BackendDown/>:logged ? <Dashboard /> : <Navigate to='/signin' />}></Route> */}
          </Routes>    
            </div> 
    </div> 
    </div>
  )
} 

export default Users
