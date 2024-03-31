import axios from "axios"
import { Button } from "../../components/Button"
import MySVG from "../../components/MySvg" 
import { BACKEND_URL } from "../config"
import { useEffect, useState } from "react"


export function Logs(){ 
 
  const [logs,setLogs] = useState([])  
      const fetchLogs = async()=>{
        console.log("function called");
        
        console.log(localStorage.getItem("TOKEN"));
        const res = await axios.get(
          `${BACKEND_URL}/api/v3/users/logs`, 
          { 
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + localStorage.getItem('TOKEN')
            }
          }
        );
    
        const logs = res.data.logs
        setLogs(logs) 
      }
     
    useEffect(()=>{
      fetchLogs()
    },[])

  return <div>
    <div className="flex flex-col">
    <div id="navbar" className="flex justify-between">
      <div className="flex w-14 -mt-10">
       <MySVG/>
      </div>
      <div> 
  <h1>Logo</h1>
      </div>
      <div>
      <div className="flex flex-col justify-center bg-slate-500 rounded-full h-12 w-12 p-4 mr-3 mt-1">
        <div className="flex flex-col justify-center h-full text text-xl">
          {localStorage.getItem('firstname')?.charAt(0).toUpperCase()}
        </div>
      </div>
      </div>
    </div>
   
      <div className="flex justify-center">
        <div className="flex w-16 mt-6">
      <svg fill="#000000" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 60 60" ><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <g> <path d="M56.5,49L56.5,49V1c0-0.6-0.4-1-1-1h-45c-0.6,0-1,0.4-1,1v14h2V2h43v46h-9c-0.6,0-1,0.4-1,1v9h-33V43h-2v16 c0,0.6,0.4,1,1,1h35c0.3,0,0.5-0.1,0.7-0.3l10-10c0.1-0.1,0.1-0.2,0.2-0.3v-0.1C56.5,49.2,56.5,49.1,56.5,49z M46.5,50h6.6 l-3.3,3.3l-3.3,3.3L46.5,50L46.5,50z"></path> <path d="M16.5,38h6h4v-2h-3V17c0-0.6-0.4-1-1-1h-6c-0.6,0-1,0.4-1,1v6h-5c-0.6,0-1,0.4-1,1v4h-5c-0.6,0-1,0.4-1,1v8 c0,0.6,0.4,1,1,1h6H16.5z M17.5,18h4v18h-4V24V18z M11.5,25h4v11h-4v-7V25z M5.5,30h4v6h-4V30z"></path> <path d="M50.5,24V7c0-0.6-0.4-1-1-1h-21c-0.6,0-1,0.4-1,1v17c0,0.6,0.4,1,1,1h21C50.1,25,50.5,24.6,50.5,24z M48.5,12h-12V8h12V12 z M34.5,8v4h-5c0-1.6,0-4,0-4H34.5z M29.5,14h5v9h-5C29.5,23,29.5,18.3,29.5,14z M36.5,23v-9h12v9H36.5z"></path> <rect x="28.5" y="28" width="21" height="2"></rect> <rect x="28.5" y="33" width="21" height="2"></rect> <rect x="28.5" y="38" width="21" height="2"></rect> <rect x="14.5" y="6" width="6" height="2"></rect> <rect x="14.5" y="11" width="9" height="2"></rect> <rect x="14.5" y="43" width="7" height="2"></rect> <rect x="24.5" y="43" width="7" height="2"></rect> <rect x="34.5" y="43" width="7" height="2"></rect> <rect x="14.5" y="48" width="7" height="2"></rect> <rect x="24.5" y="48" width="7" height="2"></rect> <rect x="34.5" y="48" width="7" height="2"></rect> <rect x="14.5" y="53" width="7" height="2"></rect> <rect x="24.5" y="53" width="7" height="2"></rect> <rect x="34.5" y="53" width="7" height="2"></rect> </g> </g> </g></svg>
        </div>
       <h1 className="mt-10 p-3 my-5 text-zinc-700 font-semibold">Your Logs</h1>
      </div>
<div className="flex justify-center">

        <Button onclick={()=>fetchLogs()} label={'Refresh'} loader={''} height={3}></Button>
</div>
        {logs.map((doctor:any)=>(
              <Doctors doctor={doctor.doctor} accessedFiles={doctor.accessedFiles}></Doctors>    
        ))}
        
    </div>
  </div>
}


function Doctors({doctor, accessedFiles}:any){
  return <div>
        <div id="heading" className="flex justify-center mt-12 font-medium text-lg text-slate-500">
          Files viewd or analyzed by Dr. {doctor}</div>
   <div id="report-section">
      
      <div id="reports-list" className=" p-4 mt-1 bg-gray-300 rounded-lg shadow-lg h-80 overflow-x-hidden overflow-scroll scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100" > 
       {accessedFiles.map((file:any)=>(
         <Files filename={file.filename} date = {file.date}></Files>  
       ))}
         
      </div>
     
    </div>
  </div>
}

function Files({filename, date}:any){
  return  <div id="reports" className="flex justify-between shadow-md shadow-slate-500 rounded-md mt-2 bg-slate-300 group hover:bg-slate-400">
  <div className="flex -ml-9 mt-2 "> 
<div className=" h-12 w-12 p-4 mr-14 mt-1 ">
<svg className="-mt-8" width="100px" height="80px" viewBox="-2.4 -2.4 28.80 28.80" fill="none" xmlns="http://www.w3.org/2000/svg" transform="rotate(0)" stroke="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="#CCCCCC" stroke-width="0.288"></g><g id="SVGRepo_iconCarrier"> <path d="M9 17H15M9 13H15M9 9H10M13 3H8.2C7.0799 3 6.51984 3 6.09202 3.21799C5.71569 3.40973 5.40973 3.71569 5.21799 4.09202C5 4.51984 5 5.0799 5 6.2V17.8C5 18.9201 5 19.4802 5.21799 19.908C5.40973 20.2843 5.71569 20.5903 6.09202 20.782C6.51984 21 7.0799 21 8.2 21H15.8C16.9201 21 17.4802 21 17.908 20.782C18.2843 20.5903 18.5903 20.2843 18.782 19.908C19 19.4802 19 18.9201 19 17.8V9M13 3L19 9M13 3V7.4C13 7.96005 13 8.24008 13.109 8.45399C13.2049 8.64215 13.3578 8.79513 13.546 8.89101C13.7599 9 14.0399 9 14.6 9H19" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
  </div>
 <div className="mt-1 font-medium ">
  <div className="flex text-slate-800" > 
  {filename}
  {/* {report.filename.charAt(0).toUpperCase()+ report.filename.slice(1)}  */} 
  </div>
 
  
  <p id="date-text" className="flex text-slate-400 group-hover:text-slate-500">Viewd on: {date}
  {/* {report.date.split(' G')[0]} */}
  </p>
 </div>
</div> 
 <div className="flex justify-center h-full mr-2 ml-4">
  <Button height={11} loader={''} onclick={()=> {
    // localStorage.setItem('viewFile',report.filename) 
    // window.open(`${content}`,'_blank', 'noreferrer')
    }} label={"View on Blockhain"}></Button> 
 </div>
</div>
}
