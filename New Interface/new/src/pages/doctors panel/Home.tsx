import { useEffect, useState } from "react" 
import { Reports } from "../../components/Reports" 
import { Button } from "../../components/Button"
import { InputBox } from "../../components/InputBox"
import axios from "axios"
import { BACKEND_URL } from "../config"
import {LucideBriefcaseMedical, LucideHospital } from "lucide-react"
// import { BACKEND_URL } from "../config"
// import axios from "axios"


export function Home(){ 
  const [input, setInput] = useState('')
  const [search,setSearch] = useState(false)
  const [access,setAccess] = useState(false)
 
   
  return <div>
    <div className="flex flex-col px-7"> 
     <div id="report-section" > 
     <div className="flex justify-between">
     <div className="flex -mt-36">  
     <div className=" ">
      < LucideHospital size={55} />
     </div>
     <div className="p-3 ">
       <div className=" text-4xl font-bold text-zinc-700">
        Ayushman Healthcare
        </div>
       <div className=" max-w-3xl mt-6 text-lg font-medium">
        Here doctor can search for the patient and request access from the patient and when patient will grant te access for report then he'll able to view all the reports of that patient
       </div>
     </div>
      </div>
      <div className=" flex items-center">
        <div className=" mr-5">
          <LucideBriefcaseMedical size={34}/>
        </div>
      <div className=" text-2xl font-medium"> 
      Dr. {localStorage.getItem('docFirstname')} {localStorage.getItem('docLastname')} 
      </div>
      </div>
     </div>
     <div className=" text-3xl font-medium mt-4">
      Search for the Patient and reports
     </div>
     <div className=" -mt-5">
     <div id="inputss" className="flex justify-center mt-9 px-11"> 
    <div className=" ml-7 w-full text-slate-700">
      <InputBox placeholder={' Type username...'} label={''} onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        setAccess(true);
      }
    }} onChange={(e: any) => { setInput(e.target.value) }} value={input} />
    </div>
    
    <div className="w-24 ml-2">
      <Button height={12} onclick={()=>{setAccess(true)}} loader={''} label={'Search'}></Button>
    </div>
  </div>
    
    {access?
     (<div id="reports-listt" className=" p-4 rounded-lg shadow-lg h-80 overflow-x-hidden overflow-scroll scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 text-slate-800" >
     <Access username={input} date={"asd"}  ></Access>
      </div> ):
      
       (<div id="reports-listt" className=" scrol-report border-2 overflow-x-hidden overflow-y-scroll h-80 rounded-md shadow-md px-4">
        {search?<Reports token={localStorage.getItem('docToken')} username={input}/>:
        <div className="flex justify-center text-4xl  "> 
        <div>
          <img width={280} src="https://pub-f7df8bb286174a36bc558870137a7fb7.r2.dev/Usability%20testing-pana%20(1).png" alt="" />
        </div>
        </div>}
        </div> )} 
     </div>
     {/* <Access username={input} date={"asd"}  ></Access> */}
 
     </div>
    </div>
  </div>

function Access({username}:any){
  const [request, setRequest] = useState(true)
  const [allowText, setAllowText] = useState('')
  const [popup, setPop] = useState('')
  const [isOpen, setIsopen] = useState(false) 

  const grantAccess = async ()=>{
    console.log("sending request..");
    
    const res = await axios.post(
    `${BACKEND_URL}/api/v3/doctors/access`,
    {
      username
  },
    { 
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('docToken')
      }
    }
  );
  const response = res.data.message
  console.log(response);
  console.log("access: "+res.data.access); 
 if (response.includes('already')) {
  setIsopen(true)
  setTimeout(() => {
    setIsopen(false)
    setPop('')
  }, 2000);
  setPop(response)
 }
  // setTimeout(() => {
  //   setIsopen(false)
  //   setPop("")
  // }, (3000));
  else{
    await checkAccess()
    setTimeout(() => {
      setIsopen(false)
      setPop('')
    }, 4000);
    setIsopen(true)
    setPop("Request sent") 
    } 
  }

  const checkAccess = async()=>{
    console.log('checking access...');
    
    const res = await axios.post(
      `${BACKEND_URL}/api/v3/doctors/allow`,
      {
        username
    },
      { 
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem('docToken')
        }
      }
    );

    const response = res.data.message
    console.log("response: ");
    
    console.log(response);
    
    if (response=='allowed') {
      setSearch(true)
      setAccess(false)
    }
    else{
      setAllowText('Request on hold')
      setTimeout(() => {
        setRequest(false)
      }, 5000);
    }
  }

useEffect(()=>{
  checkAccess()
},[])  

  return      <div id="reports" className={`flex justify-between ${request?'':'hidden'} shadow-md shadow-slate-500 rounded-md mt-2 group `}> 
        <div className={`popup ${isOpen ? 'active' : 'hide'} ${popup.includes('feilds') || popup.includes('Please') || popup.includes('Invalid') || popup.includes('email') || popup.includes('down') ? 'bg-red-400 p-2 h-11' : ''} flex justify-center ml-96 text-center w-80 shadow-lg bg-green-500 text-white rounded-lg font-medium text-lg fixed top-4 h-11 p-1`}>{popup}</div>  
      <div className="flex justify-center">
  <div className="flex -ml-9 mt-2 "> 
<div className=" h-12 w-12 p-4 mr-14 mt-1 ">
<svg className="-mt-8" width="100px" height="80px" viewBox="-2.4 -2.4 28.80 28.80" fill="none" xmlns="http://www.w3.org/2000/svg" transform="rotate(0)" stroke="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="#CCCCCC" stroke-width="0.288"></g><g id="SVGRepo_iconCarrier"> <path d="M9 17H15M9 13H15M9 9H10M13 3H8.2C7.0799 3 6.51984 3 6.09202 3.21799C5.71569 3.40973 5.40973 3.71569 5.21799 4.09202C5 4.51984 5 5.0799 5 6.2V17.8C5 18.9201 5 19.4802 5.21799 19.908C5.40973 20.2843 5.71569 20.5903 6.09202 20.782C6.51984 21 7.0799 21 8.2 21H15.8C16.9201 21 17.4802 21 17.908 20.782C18.2843 20.5903 18.5903 20.2843 18.782 19.908C19 19.4802 19 18.9201 19 17.8V9M13 3L19 9M13 3V7.4C13 7.96005 13 8.24008 13.109 8.45399C13.2049 8.64215 13.3578 8.79513 13.546 8.89101C13.7599 9 14.0399 9 14.6 9H19" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
  </div>
      </div>
 <div className="mt-1 font-medium ">
  <div className="flex text-slate-800" > 
  {username.charAt(0).toUpperCase()+ username.slice(1)} 
  </div> 
    {allowText}
 </div>
</div> 
 <div className="flex justify-center h-full mr-2 ml-4"> 

  <Button height={11} loader={''} onclick={()=> { 
    grantAccess()
    // window.open(`${content}`,'_blank', 'noreferrer')
    }} label={"Request Access?"}></Button>
 
 </div>
</div>

}

}
