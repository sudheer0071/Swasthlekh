import {  CheckCircle2, Clock,LucideHistory, Share,  User, } from "lucide-react"
import { useEffect, useState } from "react" 
import axios from "axios"
import { BACKEND_URL } from "../config" 
import { useNavigate } from "react-router-dom"
import { useRecoilState } from "recoil"
import { home, requestt } from "../atom"

export const Requests = ()=>{
  const [request, setRequest] = useState(true)
  const [popup, setPop] = useState('')
  const [isOpen, setIsopen] = useState(false) 
  const [data,setData] = useState([]) 
  const [side, setSide] = useRecoilState(requestt)
   setSide(true)
  const [hom,setHom] = useRecoilState(home)
  setHom(false)
  console.log(side,hom);
  
  const fetchRequests = async()=>{
    console.log(localStorage.getItem('docToken'));
    
    const res = await axios.get(`${BACKEND_URL}/api/v3/doctors/findRequest`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('docToken')
      }
    });
    const response = res.data.message
   console.log(res.data);
   
    if (response.includes('no')) {
      setTimeout(() => {
        setIsopen(false)
        setPop('')
        setRequest(false)
      }, 2000);
      setIsopen(true) 
      setPop(response)
    }
    else{
      const allRequests = res.data.request
      setData(allRequests)
      setTimeout(() => {
        setIsopen(false)
        setPop('')
        setRequest(true)
      }, 2000);
      setIsopen(true)
      setPop(response)
    }
    
  }

  useEffect(()=>{
    fetchRequests()
  },[])

  return <div className="">
     <div className=" flex justify-center text-black">
        <div className={`popup ${isOpen ? 'active' : 'hide'} ${popup.includes('feilds') || popup.includes('Please') || popup.includes('not') || popup.includes('email') || popup.includes('down') ? 'bg-red-400 p-2 h-11' : ' bg-orange-200 text-black'} flex justify-center  text-center w-80 shadow-lg rounded-lg font-medium text-lg fixed top-4 h-11 p-1`}>{popup}</div>  
  </div>
    <div className="flex items-center text-xl md:text-4xl lg:text-4xl font-semibold mt-3 md:mt-20 lg:-mt-36 px-3">
      <div className=" scale-75 md:scale-100 lg:scale-100">
        <LucideHistory size={44}/>
      </div>
      <div className=" ml-3">
      Recently requested patients
      </div>
    </div>
    <div>
    <div className=' px-1 md:px-6 lg:px-7'>
    {request?<div className=" mt-8 md:mt-16 lg:mt-24">
      <div className="  grid gri grid-cols-2 md:grid-cols-4 lg:grid-cols-4 justify-between text-lg  font-medium">
  <div className=" text-center ">
    username
  </div>
  <div className=" hidden md:inline lg:inline  text-center text-lg font-medium  ">
     status
  </div>
  <div className=" hidden md:inline lg:inline text-center  text-lg font-medium   ">
     Date
  </div>
  <div className=" text-center ">
    Activity
  </div>
      </div>
      <div>
      {data.map((dat:any,index:any)=> <AllRequests data = {dat} key={index} /> )}
      </div>
    </div>:
    <div> 
      <div  className=" flex justify-center -mt-24">
      <img width={450} src="https://pub-f7df8bb286174a36bc558870137a7fb7.r2.dev/Search-cuate.png" alt="" />
      </div>
      </div>}
  </div>
    </div>
  </div>
}

const AllRequests = ({data}:any)=>{
  const navigate = useNavigate()
  return <div className="">
   <div id="reports" className={` grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 justify-between  border-2 shadow-slate-500 rounded-md mt-2 px-1 md:px-5 lg:px-5 bg-white`}>  

<div className="mt-1 font-medium ">

 <div className="flex mt-1 md:mt-3 lg:mt-3 text-slate-800 text-md items-center" >
   <div className=" -mt-2 md:mt-0 lg:mt-0 scale-75 md:scale-100 lg:scale-100  bg-slate-300 rounded-full p-2">
<User size={32}/>
   </div>
   <div className=" md:ml-3 lg:ml-3 lg:-mt-3"> 
     {/* {username?username?.charAt(0).toUpperCase()+ username.slice(1):''}  */} 
     {data.user}
     <div className=" font-extralight">
      {data.grant?'':'Requet on hold'}
     </div>
     <div className=" font-normal -ml-10 mt-1 text-sm flex md:hidden lg:hidden justify-center items-center"> 
 {data.grant?<div className="flex">
  <div className=" scale-75"> 
  <CheckCircle2 color="green"/>
  </div>
  <div className=" ml-1">
    Granted  
    {/* <Reports token={localStorage.getItem('docToken')} username={data.user}/> */}
  </div>
 </div>:<div className="-ml-16 flex">
  <div className=" scale-75">
  <Clock color="red"/>
  </div>
  <div className=" ml-1"> 
    Pending
  </div>
  </div>}
</div>
   </div>
 </div> 
 <div className=" ml-16 text-md font-thin -mt-4">
   {/* {allowText}  */} 
 </div>
</div> 
<div className="hidden md:flex lg:flex justify-center items-center"> 
 {data.grant?<div className="flex">
  <div> 
  <CheckCircle2 color="green"/>
  </div>
  <div className=" ml-3">
    Granted 
    <div className=" mt-1">
      <Share size={20}/> 
    </div>
    {/* <Reports token={localStorage.getItem('docToken')} username={data.user}/> */}
  </div>
 </div>:<div className=" ml-3 flex">
  <div>
  <Clock color="red"/>
  </div>
  <div className=" ml-3"> 
    Pending
  </div>
  </div>}
</div>
<div className="hidden md:flex lg:flex justify-center items-center ">
  <div className="">
  <div className=" font-medium">
    Requested on:
  </div>
     <div>
      {data.date}
     </div>
  </div>
</div>
{data.grant?<div className="  scale-75 md:scale-100 lg:scale-100  flex justify-center items-center cursor-pointer transition duration-200 ease-in-out transform md:hover:scale-95 lg:hover:scale-95 p-1 md:p-3 lg:p-3 h-full md:mr-2 lg:mr-2 md:ml-4 lg:ml-4">
<button onClick={()=> { 
  //  grantAccess() 
  localStorage.setItem('currentUser',data.user)
  navigate('/doctors/viewReports')
   // window.open(`${content}`,'_blank', 'noreferrer')
   }} className={`btn transition-colors duration-700 inline-flex items-center px-7 py-3 -mr-4 mt-3 mb-2 text-sm font-medium text-center text-white rounded-lg cursor-pointer  hover:bg-pink-500 dark:focus:ring-blue-300'}`}>View</button>
</div>:<div className="flex justify-center items-center p-3 h-full mr-2 ml-4">
  <button onClick={()=> { 
  //  grantAccess()  
   // window.open(`${content}`,'_blank', 'noreferrer')
   }} className={` scale-75 md:scale-100 lg:scale-100  transition-none transition-colors duration-700 inline-flex items-center px-7 py-3 -mr-4 mt-3 mb-2 text-sm font-medium text-center text-white rounded-lg  bg-[#ee8f8a] hover:bg-none cursor-not-allowed dark:focus:ring-blue-300'}`}>View</button>
  </div>} 
</div>
  </div>
} 