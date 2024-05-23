import  {CalendarCheck, PanelsTopLeft, ScrollText, Settings } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 


export const SideBar = ({user,name}:{name:string,user:string})=>{
  // const[cursorr, setCursorr] = useRecoilState(cursor)
  const[home, setHome] = useState<boolean>(true)
  const[log, setLog] = useState<boolean>(false)
  const[request, setRequest] = useState<boolean>(false)
  const[settings, setSettings] = useState<boolean>(false)
  const navigate = useNavigate() 
  return  <div id="SIDE BAR" className=" h-screen border-r-2 navbar font-bold flex-shrink-0">  
  <div className=" flex-col  flex-1 p-4 px-3"> <div className=" font-bold font-mono text-4xl md:text-5xl mr-8 m mt-3">
        <a href="/">
      Swasth<p className=" inline text-pink-500">लेख</p>
        </a>
      </div>
  <div className=" mt-10 font-medium ml ">
  <div onClick={()=>{setHome(true);setLog(false);setRequest(false); {user=='doc'?navigate('/doctors/home'):navigate('/users/home')}}} className= {`border-b-2 cursor-pointer border-gray-500 flex p-3 rounded-md pl-10 transition duration-200 ease-in-out transform hover:bg-custom hover:text-black hover:border-gray-700 hover:scale-105 ${home?'bg-custom border-b-inherit translate-x-5 translate-y-1 transition-transform delay-100':''}`}>
<div className=" items-center">
<PanelsTopLeft size={25} />
</div>
<div className="ml-2 ">
Home
</div>
</div>
  <div onClick={()=>{setLog(true);setHome(false);setRequest(false); {user=='doc'?navigate('/doctors/pasts'):navigate('/users/logs')}}} className= {`border-b-2 cursor-pointer border-gray-500 flex p-3 rounded-md pl-10 transition duration-200 ease-in-out transform hover:bg-custom hover:text-black  hover:border-gray-700 hover:scale-105 ${log?'bg-custom translate-x-5 translate-y-1 transition-transform border-b-inherit delay-100':''}`}>
<div className=" items-center">
<ScrollText size={25} />
</div>
<div className=" ml-2 ">
{user=='doc'?'Pasts':'Log Book'}
</div>
</div>
  <div onClick={()=>{setRequest(true);setLog(false);setHome(false); ;{user=='doc'?navigate('/doctors/requests'):navigate('/users/requests')}}} className={`border-b-2 cursor-pointer border-gray-500 flex p-3 rounded-md pl-10 transition duration-200 ease-in-out transform hover:bg-custom hover:text-black hover:border-gray-700 hover:scale-105 ${request?'bg-custom translate-x-5 translate-y-1 transition-transform border-b-inherit delay-100':''}`}>
<div className=" items-center">
<CalendarCheck size={25} />
</div>
<div className=" ml-2 ">
Requests
</div>
</div>
  <div onClick={()=>{setSettings(true);navigate('/')}} className={`border-b-2 cursor-pointer border-gray-500 flex p-3 rounded-md pl-10 transition duration-200 ease-in-out transform hover:bg-custom hover:text-black hover:border-gray-700 hover:scale-105 ${settings?'bg-orange-100 translate-x-2 translate-y-1 transition-transform delay-100':''}`}>
<div className=" items-center">
<PanelsTopLeft size={25} />
</div>
<div className=" ml-2 ">
Invoice
</div>
</div>
  <div onClick={()=>{setSettings(true);navigate('/')}} className=" border-b-2 cursor-pointer border-gray-500 flex p-3 rounded-md pl-10 transition duration-200 ease-in-out transform hover:bg-custom hover:text-black hover:border-gray-700 hover:scale-105">
<div className=" items-center">
<Settings size={25} />
</div>
<div className=" ml-2 ">
Settings
</div>
</div>
  </div>
</div>
  <div className=" border-t-2 border-black flex flex-1 ml-4 bottom-2 px-6   fixed flex-col hover:bg-[#fcf4e9]">
    <div className=" flex p-3">
    <div className=" text-center bg-slate-300 rounded-full size-12 text-xl ">
      <div className=' flex justify-center mt-2'>
    {name.charAt(0).toUpperCase()} 
      </div>
      </div>
    <div className=" ml-4">
    <div className=" ">
    {name.toUpperCase()}
    </div>
    <div className=" font-normal">
      {name}@gmail.com
    </div>
    </div>
    </div>
  </div>
  </div>
}