import {  CheckCircle2, Clock, Share,  User, } from "lucide-react"
import { useEffect, useState } from "react"
import { Button } from "../../components/Button"
import axios from "axios"
import { BACKEND_URL } from "../config" 

export const Requests = ()=>{
  const [request, setRequest] = useState(true)
  const [popup, setPop] = useState('')
  const [isOpen, setIsopen] = useState(false) 
  const [data,setData] = useState([])

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

  return <div>
     <div className=" flex justify-center">
        <div className={`popup ${isOpen ? 'active' : 'hide'} ${popup.includes('feilds') || popup.includes('Please') || popup.includes('not') || popup.includes('email') || popup.includes('down') ? 'bg-red-400 p-2 h-11' : ''} flex justify-center  text-center w-80 shadow-lg bg-green-500 text-white rounded-lg font-medium text-lg fixed top-4 h-11 p-1`}>{popup}</div>  
  </div>
    <div className=" text-4xl font-semibold -mt-36 px-3">
      Recently requested patients
    </div>
    <div>
    <div className=' px-7'>
    {request?<div className=" mt-24">
      <div className=" flex justify-between text-lg ml-5 font-medium">
  <div className=" ">
    username
  </div>
  <div className="  text-lg font-medium  0 ">
     status
  </div>
  <div className="  text-lg font-medium mr-10 ">
     Date
  </div>
  <div className=" mr-10">
    Activity
  </div>
      </div>
      {data.map((dat:any,index:any)=> <AllRequests data = {dat} key={index} /> )}
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
  return <div>
   <div id="reports" className={`flex justify-between  border-2 shadow-slate-500 rounded-md mt-2 px-5 bg-white`}>  

<div className="mt-1 font-medium ">

 <div className="flex mt-3 text-slate-800 text-md items-center" >
   <div className=" bg-slate-300 rounded-full p-2">
<User size={32}/>
   </div>
   <div className=" ml-3 -mt-3"> 
     {/* {username?username?.charAt(0).toUpperCase()+ username.slice(1):''}  */} 
     {data.user}
   </div>
 </div> 
 <div className=" ml-16 text-md font-thin -mt-4">
   {/* {allowText}  */} 
 </div>
</div> 
<div className=" flex justify-center items-center "> 
 {data.grant?<div className="flex">
  <div> 
  <CheckCircle2/>
  </div>
  <div className=" ml-3">
    Granted 
    <div className=" mt-1">
      <Share size={20}/> 
    </div>
    {/* <Reports token={localStorage.getItem('docToken')} username={data.user}/> */}
  </div>
 </div>:<div className=" flex">
  <div>
  <Clock/>
  </div>
  <div className=" ml-3"> 
    Pending
  </div>
  </div>}
</div>
<div className=" flex justify-center items-center ">
  <div className="">
  <div className=" font-medium">
    Requested on:
  </div>
     <div>
      {data.date}
     </div>
  </div>
</div>
<div className="flex justify-center cursor-pointer transition duration-200 ease-in-out transform hover:scale-95 h-full mr-2 ml-4"> 
 
 <Button height={11} loader={''} onclick={()=> { 
   // grantAccess() 
   // window.open(`${content}`,'_blank', 'noreferrer')
   }} label={"Request Access?"}></Button>

</div>
</div>
  </div>
} 