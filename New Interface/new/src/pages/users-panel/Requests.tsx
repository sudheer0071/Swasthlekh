import axios from "axios" 
import { BACKEND_URL } from "../config"
import { useEffect, useState } from "react"   
import { ClipboardMinus, RefreshCcw, SquareCheckBig, X } from "lucide-react"
 

export function Requests(){ 
  const [popup, setPopup] = useState("")
  const [isOpen, setIsopen] = useState(false)
  const [loader,setloader] = useState('')  
  const [request,setRequest] = useState([])  
      const fetchLogs = async()=>{
        console.log("function called");
        setloader('refresh')
        setIsopen(true)
        setPopup("Refreshing")
        console.log(localStorage.getItem("TOKEN"));
        const res = await axios.get(
          `${BACKEND_URL}/api/v3/users/access`, 
          { 
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + localStorage.getItem('TOKEN')
            }
          }
        );
    
        const response = res.data.access
        setTimeout(() => {
          setIsopen(false)
          setPopup('')
          setloader('') 
        }, 2000);
        setPopup('Refreshed')
        console.log(response);
        setRequest(response)   
      }
     
    useEffect(()=>{
      console.log(loader);
      
      fetchLogs()
    },[])

  return <div>
    <div className="flex flex-col p-4 -mt-20 ">
      <div className="flex justify-center">
    <div className={`popup ${isOpen ? 'active' : 'hide'} $flex flex-col text-center w-96 shadow-lg bg-green-500 rounded-lg font-medium text-lg fixed top-4 h-11 p-1`}>{popup}
  </div>
      </div> 
      <div className=" flex justify-between">
        <div className="">
          <div className=" text-3xl -mt-10 font-semibold">
            Requests
          </div>
          <div className=" max-w-xl mt-5">
            All requests that are made by doctor to view or analyze reports will be showed up here and you can grant and discard accordingly
          </div>
        </div>
        <div onClick={fetchLogs} className="flex mt-16 mr-10 hover:bg-orange-100 p-2 rounded-md cursor-pointer">
          <div className=" mr-3 text-lg font-medium">
            Refresh
          </div>
          <RefreshCcw size={30} />
        </div>
      </div>
<div>
  {request.length==0?(<div>
    <div id="reports-listt" className=" p-4  rounded-lg shadow-lg h-80   scrollbar-track-gray-100" > 
    <h1 className="flex justify-center mt-20  text-4xl">
      
        You have no requests
    </h1>
      </div>
  </div>):( <div>
    <div>
    <div className=" p-2 grid grid-cols-3 justify-between">
        <div className=" flex">
          <div className=" font-bold w-36">
            Doctor Name
          </div>
        </div> 
        <div className=" flex flex-col">
          <div className=" font-bold">
            Requested Time
          </div>
        </div>
        <div className=" font-bold flex flex-col">
          <div>
            Actions
          </div>
        </div>
        <div className=" flex px-2">
          <div>
          </div>
          <div className=" ml-7">
          </div>
        </div>
      </div>
    </div>
     <div id="reports-listt" className=" scrol-report overflow-x-hidden overflow-y-scroll max-h-80 rounded-md shadow-md border py-3 px-4 bg-white">
 
   {request.map((doctor:any, key:any)=>(
                <RequestCard key={key} doctor={doctor.doctor} date={doctor.date}/>  
          ))} 
        
  </div>
  </div>
 )}
  
</div>
 
<div className=" flex justify-center">
    <div className=" fixed -z-50 bottom-0 flex justify-center">
      <img width={390} src="https://pub-f7df8bb286174a36bc558870137a7fb7.r2.dev/Confirmed-cuate.png" alt="" />
    </div>
</div>
    </div>
  </div>
}


// function Doctors({doctor, accessedFiles}:any){
//   return <div>
//         <div id="heading" className="flex justify-center mt-4 font-medium text-lg text-slate-500">
//           Files viewd or analyzed by Dr. {doctor}</div>
//    <div id="report-section">
      
//       <div id="reports-list" className=" p-4 mt-1 bg-gray-300 rounded-lg shadow-lg h-80 overflow-x-hidden overflow-scroll scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100" > 
//        {accessedFiles.map((file:any)=>(
//          <Files filename={file.filename} date = {file.date} actions={file.actions}></Files>  
//        ))}
         
//       </div>
     
//     </div>
//   </div>
// }

// function Doctors({doctor, date}:any){
//   const [popup, setPopup] = useState("")
//   const [grandted,setGranted] = useState(false) 
//   const [isOpen, setIsopen] = useState(false)
//   // const [loader,setloader] = useState('')

//   const grantAccess = ()=>{
  
//     setTimeout(() => {
//       setIsopen(false)
//       setPopup('Access Granted')
//       setGranted(true)
//     }, 3000);
//     setIsopen(true)
//     setPopup('Granting Access...')
//   }

//   return  <div>
//     {grandted?(<div className="flex justify-between shadow-slate-500 rounded-md mt-2 bg-slate-300 group hover:bg-slate-400">
//     </div>):
//     (<div>
//   <div id="reports" className="flex justify-between shadow-md shadow-slate-500 rounded-md mt-2 bg-slate-300 group hover:bg-slate-400"> 
//     <div className={`popup ${isOpen ? 'active' : 'hide'} $flex flex-col text-center ml-96 w-96 shadow-lg bg-green-500 rounded-lg font-medium text-lg fixed top-4 h-11 p-1`}>{popup}
//   </div> 
//   <div className="flex -ml-9 mt-2 "> 
// <div className=" h-12 w-12 p-4 mr-14 mt-1 ">
// <svg className="-mt-8" width="100px" height="80px" viewBox="-2.4 -2.4 28.80 28.80" fill="none" xmlns="http://www.w3.org/2000/svg" transform="rotate(0)" stroke="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="#CCCCCC" stroke-width="0.288"></g><g id="SVGRepo_iconCarrier"> <path d="M9 17H15M9 13H15M9 9H10M13 3H8.2C7.0799 3 6.51984 3 6.09202 3.21799C5.71569 3.40973 5.40973 3.71569 5.21799 4.09202C5 4.51984 5 5.0799 5 6.2V17.8C5 18.9201 5 19.4802 5.21799 19.908C5.40973 20.2843 5.71569 20.5903 6.09202 20.782C6.51984 21 7.0799 21 8.2 21H15.8C16.9201 21 17.4802 21 17.908 20.782C18.2843 20.5903 18.5903 20.2843 18.782 19.908C19 19.4802 19 18.9201 19 17.8V9M13 3L19 9M13 3V7.4C13 7.96005 13 8.24008 13.109 8.45399C13.2049 8.64215 13.3578 8.79513 13.546 8.89101C13.7599 9 14.0399 9 14.6 9H19" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
//   </div>
//  <div className="mt-1 font-medium ">
//   <div className="flex text-slate-900" > 
//   {/* {Doctors} */}
//   {doctor.charAt(0).toUpperCase()+ doctor.slice(1)}  
//   </div>
 
  
//   <p id="date-text" className="flex text-slate-500 group-hover:text-slate-500">Requested on: {date}
//   {/* {report.date.split(' G')[0]} */}
//   </p>
//  </div>
// </div> 
//  <div className="flex justify-center h-full mr-2 ml-4">
//   <Button height={11} loader={''} onclick={()=> {
//     grantAccess()
//     // localStorage.setItem('viewFile',report.filename) 
//     // window.open(`${content}`,'_blank', 'noreferrer')
//     }} label={"Grant Access"}></Button> 
//  </div>
// </div>
//     </div>)}
//   </div>
// }

export const RequestCard = ({ doctor, date }: any) => {
  localStorage.setItem('doctorId',doctor)
  const [popup, setPopup] = useState("")
  const [grandted,setGranted] = useState(false) 
  const [isOpen, setIsopen] = useState(false)
  // const [loader,setloader] = useState('')

  const grantAccess = async()=>{
 const response = await axios.delete(
  `${BACKEND_URL}/api/v3/users/access`, 
  { data:{
    doctor
  },
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('TOKEN')
    }
  }
);
    setTimeout(() => {
      setIsopen(false)
      setPopup(response.data.message)
      setGranted(true)
    }, 3000);
    setIsopen(true)
    setPopup('Granting Access...')
  } 

  return <div>
   {grandted?(<div className="flex px-4 justify-between border-b-2 rounded-md mt-2 text-lg font-medium" >Dr. {(doctor.charAt(0).toUpperCase()+ doctor.slice(1)).split('@')[0]} has now access to reports
    </div>):
    (<div>
       <div className=" grid grid-cols-3 border-b-2 p-2 justify-between">
       <div className={`popup ${isOpen ? 'active' : 'hide'} $flex flex-col text-center ml-96 w-96 shadow-lg bg-green-500 rounded-lg font-medium text-lg fixed top-4 h-11 p-1`}>{popup}
  </div> 
    <div className=" flex">
      <div>
        <ClipboardMinus />
      </div>
      <div className=" ml-2 font-mono ">
        <div className=" font-semibold">
          Dr. {(doctor.charAt(0).toUpperCase()+ doctor.slice(1)).split('@')[0]}
        </div>
        <div className=" font-thin">
      {doctor.charAt(0).toUpperCase()+ doctor.slice(1)}  
        </div>

      </div>
    </div> 
    <div className=" flex flex-col">
      <div className=" font-medium">
        Requested at
      </div>
      <div className=" font-light">
        {date.split(' G')[0]}
      </div>
    </div>
    <div className=" fles flex-col items-center ml-3">
      <div className=" flex">
        <div onClick={grantAccess} className=" p-2 cursor-pointer transition duration-200 ease-in-out transform hover:scale-125 text-slate-500 hover:text-green-600">
          <SquareCheckBig/>
        </div>
        <div className=" ml-6 p-2 cursor-pointer transition duration-200 ease-in-out transform hover:scale-125 text-slate-500 hover:text-red-500">
          <X/>
        </div>
        {/* {actions.length == 0 ? 'Viewed' : actions} */}
      </div>
    </div>
    {/* <div className=" flex">
      <div className="hover:bg-orange-100 cursor-pointer items-center px-2">

      </div>
      <div className=" ml-7 cursor-pointer">
        <div className=" hover:bg-orange-100 px-2">

        </div>
      </div>
    </div> */}
  </div>
  </div>)}
   
  </div>
} 