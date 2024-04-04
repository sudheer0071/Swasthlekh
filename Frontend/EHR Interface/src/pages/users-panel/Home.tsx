import { useNavigate } from "react-router-dom" 
import MySVG from "../../icons/MySvg"
import { Reports } from "../../components/Reports"
import { Upload } from "../../components/Upload"  
import { Button } from "../../components/Button" 
export function Home(){ 

  const navigate = useNavigate()

  return <div>
    <div className="flex flex-col">
    <div id="navbar" className="flex justify-between">
      <div className="flex w-14 -mt-16 cursor-pointer">
       <MySVG onclick={()=> navigate('/users/logs')} label={'Check logs'} ></MySVG>
      </div>
      <div>  
      </div>
      <div>
      <div className="flex flex-col justify-center bg-slate-500 rounded-full h-12 w-12 p-4 mr-3">
        <div className="flex flex-col justify-center h-full text text-xl">
          {localStorage.getItem('firstname')?.charAt(0).toUpperCase()}
        </div>
      </div>
      </div>
    </div> 
      <div id="upload" className="cursor-pointer w-full mt-10">
        <Upload/> 
    </div>
     <div id="report-section">
      <div className="flex justify-center">
        <div className="flex w-16 mt-6">
      <svg fill="#000000" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 60 60" ><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <g> <path d="M56.5,49L56.5,49V1c0-0.6-0.4-1-1-1h-45c-0.6,0-1,0.4-1,1v14h2V2h43v46h-9c-0.6,0-1,0.4-1,1v9h-33V43h-2v16 c0,0.6,0.4,1,1,1h35c0.3,0,0.5-0.1,0.7-0.3l10-10c0.1-0.1,0.1-0.2,0.2-0.3v-0.1C56.5,49.2,56.5,49.1,56.5,49z M46.5,50h6.6 l-3.3,3.3l-3.3,3.3L46.5,50L46.5,50z"></path> <path d="M16.5,38h6h4v-2h-3V17c0-0.6-0.4-1-1-1h-6c-0.6,0-1,0.4-1,1v6h-5c-0.6,0-1,0.4-1,1v4h-5c-0.6,0-1,0.4-1,1v8 c0,0.6,0.4,1,1,1h6H16.5z M17.5,18h4v18h-4V24V18z M11.5,25h4v11h-4v-7V25z M5.5,30h4v6h-4V30z"></path> <path d="M50.5,24V7c0-0.6-0.4-1-1-1h-21c-0.6,0-1,0.4-1,1v17c0,0.6,0.4,1,1,1h21C50.1,25,50.5,24.6,50.5,24z M48.5,12h-12V8h12V12 z M34.5,8v4h-5c0-1.6,0-4,0-4H34.5z M29.5,14h5v9h-5C29.5,23,29.5,18.3,29.5,14z M36.5,23v-9h12v9H36.5z"></path> <rect x="28.5" y="28" width="21" height="2"></rect> <rect x="28.5" y="33" width="21" height="2"></rect> <rect x="28.5" y="38" width="21" height="2"></rect> <rect x="14.5" y="6" width="6" height="2"></rect> <rect x="14.5" y="11" width="9" height="2"></rect> <rect x="14.5" y="43" width="7" height="2"></rect> <rect x="24.5" y="43" width="7" height="2"></rect> <rect x="34.5" y="43" width="7" height="2"></rect> <rect x="14.5" y="48" width="7" height="2"></rect> <rect x="24.5" y="48" width="7" height="2"></rect> <rect x="34.5" y="48" width="7" height="2"></rect> <rect x="14.5" y="53" width="7" height="2"></rect> <rect x="24.5" y="53" width="7" height="2"></rect> <rect x="34.5" y="53" width="7" height="2"></rect> </g> </g> </g></svg>
        </div>
       <h1 className="mt-10 p-3 my-5 text-zinc-700 font-semibold">Your past Reports</h1>
      </div>
      
       <div id="reports-list" className=" p-4 bg-slate-300 rounded-lg shadow-lg h-80 overflow-x-hidden overflow-scroll scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100" >
          <Reports token={localStorage.getItem('TOKEN')}/>
       </div>
      <Button height={12} loader={''} label={"View Requests"} onclick={()=>{navigate('/users/requests')}}></Button>
     </div>
    </div>
  </div>
}