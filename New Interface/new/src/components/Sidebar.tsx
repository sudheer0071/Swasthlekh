import  {CalendarCheck, PanelsTopLeft, ScrollText, Settings } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { useRecoilState } from 'recoil';
import {  home, log, requestt } from '../pages/atom';


export const SideBar = ({user,name,email}:{name:string,user:string,email?:string})=>{ 
  const[settings, setSettings] = useState<boolean>(false)

  const [hom,setHom] = useRecoilState(home)
  const[logs,setLogs] = useRecoilState(log)
  const [req,setReq] = useRecoilState(requestt)

  const navigate = useNavigate() 
  return  <div id="SIDE BAR" className=" h-screen border-r-2 navbar font-bold flex-shrink-0">  
  <div className=" flex-col  flex-1 py-4 px-0 lg:px-3"> 
    <div className=" font-bold font-mono text-4xl md:text-5xl mr-8 m mt-3">
        <a href="/" className=' hidden lg:inline'>
      Swasth<p className=" inline text-pink-500">लेख</p>
        </a>
      </div>
  <div className=" mt-10 font-medium ml ">
  <div onClick={()=>{setReq(false); setLogs(false); {user=='doc'?navigate('/doctors/home'):navigate('/users/home')}}} className= {`border-b-2 cursor-pointer border-gray-500 flex p-3 rounded-md pl-3 lg:pl-10 transition duration-200 ease-in-out transform hover:bg-custom hover:text-black hover:border-gray-700 hover:scale-105 ${hom?'bg-custom border-b-inherit translate-x-3 lg:translate-x-5 translate-y-1 transition-transform delay-100':''}`}>
<div className=" ml-1 lg:ml-2 items-center">
<PanelsTopLeft size={25} />
</div>
<div className="ml-2  hidden lg:inline "> 
Home
</div>
</div>
  <div onClick={()=>{setHom(false); setReq(false); {user=='doc'?navigate('/doctors/history'):navigate('/users/logs')}}} className= {`border-b-2 cursor-pointer border-gray-500 flex p-3 rounded-md pl- lg:pl-10 transition duration-200 ease-in-out transform hover:bg-custom hover:text-black  hover:border-gray-700 hover:scale-105 ${logs?'bg-custom translate-x-3 lg:translate-x-5 translate-y-1 transition-transform border-b-inherit delay-100':''}`}>
<div className=" ml-1 lg:ml-2  items-center">
<ScrollText size={25} />
</div>
<div className=" ml-2  hidden lg:inline">
{user=='doc'?' History':'Log Book'}
</div>
</div>
  <div onClick={()=>{setHom(false);setLogs(false) ;{user=='doc'?navigate('/doctors/requests'):navigate('/users/requests')}}} className={`border-b-2 cursor-pointer border-gray-500 flex p-3 rounded-md pl- lg:pl-10 transition duration-200 ease-in-out transform hover:bg-custom hover:text-black hover:border-gray-700 hover:scale-105 ${req?'bg-custom translate-x-3 lg:translate-x-5 translate-y-1 transition-transform border-b-inherit delay-100':''}`}>
<div className=" ml-1 lg:ml-2  items-center">
<CalendarCheck size={25} />
</div>
<div className=" ml-2 hidden lg:inline ">
Requests
</div>
</div>
  <div onClick={()=>{setSettings(true);navigate('/')}} className={`border-b-2 cursor-pointer border-gray-500 flex p-3 rounded-md pl- lg:pl-10 transition duration-200 ease-in-out transform hover:bg-custom hover:text-black hover:border-gray-700 hover:scale-105 ${settings?'bg-orange-100 translate-x-3 lg:translate-x-2 translate-y-1 transition-transform delay-100':''}`}>
<div className=" ml-1 lg:ml-2  items-center">
<PanelsTopLeft size={25} />
</div>
<div className=" ml-2  hidden lg:inline">
Invoice
</div>
</div>
  <div onClick={()=>{setSettings(true);navigate('/')}} className=" border-b-2 cursor-pointer border-gray-500 flex p-3 rounded-md pl- lg:pl-10 transition duration-200 ease-in-out transform hover:bg-custom hover:text-black hover:border-gray-700 hover:scale-105">
<div className=" ml-1 lg:ml-2  items-center">
<Settings size={25} />
</div>
<div className=" ml-2  hidden lg:inline">
Settings
</div>
</div>
  </div>
</div>
  <div className=" border-t-2 border-slate-500 flex flex-1 bottom-2 px-0 lg:px-4 fixed flex-col hover:bg-[#fcf4e9]">
    <div className=" flex ml-1 lg:m-0 py-3">
    <div className=" text-center bg-slate-300 rounded-full size-10 lg:size-12 text-xl ">
      <div className=' flex justify-center mt-2'>
    {name.charAt(0).toUpperCase()} 
      </div>
      </div>
    <div className="hidden lg:inline ml-4">
    <div className=" ">
    {name.toUpperCase()}
    </div>
    <div className=" font-normal">
      {email}
    </div>
    </div>
    </div>
  </div>
  </div>
}