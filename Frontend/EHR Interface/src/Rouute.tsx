import { useNavigate } from "react-router-dom";
import { Button } from "./components/Button"; 
import Storage from "./icons/Storage";
import { Analyze } from "./icons/Analyze";
import { Discuss } from "./icons/Discuss";  
import { Accessed } from "./icons/Accessed";
import { Recieve } from "./icons/Recieve";
import { Search } from "./icons/Searrch";
import { Send } from "./icons/Send";

export function Rouute(){
  const navigate = useNavigate(); 
  const handleUserClick = () => {
    console.log('hidfs');
    
    navigate('/users/signup');
  };

  const handleDoctorClick = () => {
    navigate('/doctors/signup');
  };   

  return  <div>  
      <div className="flex justify-center mt-16">   
<div className="flex flex-col justify-center w-full mr-4"> 
    <h1 className=" flex justify-center text-slate-700 font-semibold text-4xl "> I am a Patient</h1>
    <div id="reports-list" className="report-list p-4 mt-10 bg-slate bg-slate-300 rounded-lg shadow-2xl h-96 overflow-x-hidden overflow-scroll scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100" > 
    <div className=" text-slate-800 font-medium text-left text-1xl"> 
    <div className="flex shadow-lg border bg-slate-200 p-1 rounded-t-lg">
      <div className="flex">
       <Storage />  
      </div> 
      <div className="ml-3">Store Your reports </div>
    </div>
    <div className="flex shadow-lg border bg-slate-200 p-1 rounded-t-lg mt-2">
      <div className="flex">
       <Analyze />  
      </div> 
      <div className="ml-3">  Analyse them </div>
    </div>
    <div className="flex shadow-lg border bg-slate-200 p-1 rounded-t-lg mt-2">
      <div className="flex">
       <Discuss />  
      </div> 
      <div className="ml-3"> Discuss Your reports without chatbot</div>
    </div>
    <div className="flex shadow-lg border bg-slate-200 p-1 rounded-t-lg mt-2">
      <div className="flex">
       <Accessed />  
      </div> 
      <div className=" ml-3 text-left "> Get Permanent logs of who accessed your profile and which report</div>
    </div>
    <div className="flex shadow-lg border bg-slate-200 p-1 rounded-t-lg mt-2">
      <div className="flex">
       <Recieve />  
      </div> 
      <div className="ml-3"> Recieve reports from Hospital/Doctor </div>
    </div> 
    </div>
       </div>
      <div className="flex justify-center  -mt-20">
        <Button label={'Join as a user'} height={12} loader={''} onclick={handleUserClick}></Button>
      </div>
</div> 
<div className="flex flex-col justify-center w-full ml-5 ">
    <h1 className="flex justify-center text-slate-700 text-4xl font-semibold "> I am a Doctor</h1>
    <div id="reports-list" className="mainpage p-4 mt-10  bg-slate-300 rounded-lg shadow-lg h-96 overflow-x-hidden overflow-scroll scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100" > 
    <div className="text-slate-800 font-medium text-left text-1xl "> 
    <div className="flex shadow-lg border bg-slate-200 p-1 rounded-t-lg mt-2">
      <div className="flex">
       <Search />  
      </div> 
      <div className="ml-3"> Search Your Patient </div>
    </div>
    <div className="flex shadow-lg border bg-slate-200 p-1 rounded-t-lg mt-2">
      <div className="flex">
       <Analyze />  
      </div> 
      <div className="flex ml-3">
      Access patient data
      </div>
    </div> 
    <div className="flex shadow-lg border bg-slate-200 p-1 rounded-t-lg mt-2">
      <div className="flex">
       <Send />  
      </div> 
      <div className=" ml-3">Send them their reports</div>
    </div>
    <div className="flex shadow-lg border bg-slate-200 p-1 rounded-t-lg mt-2">
      <div className="flex">
       <Analyze />  
      </div> 
      <div className="flex ml-3">
       Analyze their Medical Records before Major tocatment 
      </div>
    </div> 
    <div className="flex shadow-lg border bg-slate-200 p-1 rounded-t-lg mt-2">
      <div className="flex">
       <Analyze />  
      </div> 
      <div className="flex ml-3">
       Manage your patient medical records 
      </div>
    </div> 
    </div> 
       </div>
      <div className="flex justify-center -mt-20">
        <Button label={'Join as a doctor'} height={12} loader={''} onclick={handleDoctorClick}></Button>
      </div> 
</div> 
      </div>

      <div className="flex">
        <div className="flex">
          
        </div>
         <div className="flex">

         </div>
      </div>
  </div>
}