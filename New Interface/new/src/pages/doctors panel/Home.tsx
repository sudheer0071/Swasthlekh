import {  useState } from "react" 
import { Reports } from "../../components/Reports" 
import { Button } from "../../components/Button"
import { InputBox } from "../../components/InputBox"
import axios from "axios"
import { BACKEND_URL } from "../config"
import {  LucideBriefcaseMedical, LucideHospital, Search, User } from "lucide-react"  
import { useNavigate } from "react-router-dom"
import { useRecoilState } from "recoil"
import { home } from "../atom"


export function Home(){ 
  const [input, setInput] = useState('')
  const [search,setSearch] = useState(false)
  const [access,setAccess] = useState(false) 
  const [popup, setPop] = useState('')
  const [isOpen, setIsopen] = useState(false) 
  const [found, setFound] = useState(false)
  const [view, setView] = useState(false)
  const [side, setSide] = useRecoilState(home)
  setSide(true) 
  console.log(side);
  
  console.log(localStorage.getItem('lname'));
  

  const findUser = async()=>{
    if (input=='') {
      setTimeout(() => {
        setIsopen(false)
        setPop('')
      }, 3000);
      setIsopen(true)
      setPop('Please type something first')
      
    }
    else{
      localStorage.setItem('searchedUser',input)
      setAccess(true);
      setIsopen(true)
      setPop("Searching")
      const res = await axios.post(`${BACKEND_URL}/api/v3/doctors/find`, {
        username: input
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem('docToken')
        }
      });
      const response = res.data.message
      if (response.includes('found!')) {
        setFound(true)
        setTimeout(() => {
          setIsopen(false)
          setPop("") 
          checkGrant()
        }, 3000);
        setPop(response)
      }
    else{
      console.log('inside else'); 
        setTimeout(() => {
          setIsopen(false)
          setPop("")
        }, 3000);
        setPop(response)
      }
    }
    }
   
  const checkGrant = async()=>{
    console.log("inside grant");
    
    const res = await axios.post(
      `${BACKEND_URL}/api/v3/doctors/checkGrant`,
      {
        username:localStorage?.getItem('searchedUser')
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
    
    if (response.includes('granted')) {
      setView(true)
    }
  }

  return <div>
    <div className="flex flex-col px-2 md:px-5 lg:px-7"> 
    <div className=" flex justify-center">
        <div className={`popup ${isOpen ? 'active' : 'hide'} ${popup.includes('feilds') || popup.includes('Please') || popup.includes('not') || popup.includes('email') || popup.includes('down') ? 'bg-red-400 p-2 h-11' : ' text-black bg-orange-200'} flex justify-center  text-center w-80 shadow-lg  rounded-lg font-medium text-lg fixed top-4 h-11 p-1`}>{popup}</div>  
  </div>
     <div id="report-section" > 
     <div className="lg:flex justify-between">
      <div>
     <div className="flex -mt-7 sm:mt-8 md:mt-20 lg:-mt-36">  
     <div className="   scale-50 md:scale-95 lg:scale-100">
      < LucideHospital size={55} />
     </div>
     <div className="p-3 ">
       <div className=" text-lg sm:text-2xl md:text-4xl lg:text-4xl font-bold text-zinc-700">
        Ayushman Healthcare
        </div>
     </div>
      </div>
       <div className=" max-w-3xl mt- md:mt-6 lg:mt-6 md:text-lg lg:text-lg font-medium">
        Here doctor can search for the patient and request access from the patient and when patient will grant te access for report then he'll able to view all the reports of that patient
       </div>
      </div>
      <div className="absolute right-4 flex items-center">
        <div className=" scale-75 md:scale-95 lg:scale-100 mr-5">
          <LucideBriefcaseMedical size={34}/>
        </div>
      <div className=" text-lg md:text-xl lg:text-2xl font-medium"> 
      Dr. {localStorage.getItem('docFname')||''} {localStorage.getItem('docLname')=='undefined' || localStorage.getItem('docLname')=='null'?'':localStorage.getItem('docLname')} 
      </div>
      </div>
     </div>
     <div className=" text-xl md:text-2xl lg:text-4xl font-medium mt-10 md:mt-5 lg:mt-7">
      Search for the Patient and reports
     </div>
     <div className=" -mt-5">
     <div id="inputss" className="flex justify-center mt-2 md:mt-8 lg:mt-10 px-1 md:px-9 lg:px-11"> 
    <div className=" md:ml-6 lg:ml-7 w-full text-slate-700">
      <InputBox placeholder={' Type username...'} label={''} onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') { 
        findUser(); 
      }
    }} onChange={(e:any)=>{
      setInput(e.target.value)
    }} />
    </div>
    
    <div onClick={()=>{findUser()}} className=" mt-7 -ml-10 cursor-pointer transition duration-200 ease-in-out transform hover:scale-125 text-slate-500">
      <Search size={28} /> 
    </div>
  </div>
    <div className=" -mt-0 md:mt-4 lg:mt-5">
    {access?
     (<div id="reports-listt" className=" md:p-3 lg:p-4 rounded-lg shadow-lg h-64 md:h-80 lg:h-80 text-slate-800" >
      {found?<Access></Access>:<div className=" flex justify-center">
        <img width="288" src="https://pub-f7df8bb286174a36bc558870137a7fb7.r2.dev/Search-amico.png" alt="" />
        </div>} 
      </div> ): 
       (<div id="reports-listt" className=" scrol-report border-2 overflow-x-hidden overflow-y-scroll h-64 md:h-80 lg:h-80 rounded-md shadow-md px-0 md:px-3 lg:px-4">
        {search?<Reports white={false} token={localStorage.getItem('docToken')} username={localStorage?.getItem('searchedUser')}/>:
        <div className="flex justify-center text-4xl  "> 
        <div>
          <img width={280} src="https://pub-f7df8bb286174a36bc558870137a7fb7.r2.dev/Usability%20testing-pana%20(1).png" alt="" />
        </div>
        </div>}
        </div> )} 
    </div>
     </div>
     {/* <Access username={input} date={"asd"}  ></Access> */}
 
     </div>
    </div>
  </div>

function Access(){
  const [request, setRequest] = useState(true)
  const [allowText, setAllowText] = useState('')
  const [popup, setPop] = useState('')
  const [isOpen, setIsopen] = useState(false)  
  const navigate = useNavigate()
  const username = localStorage?.getItem('searchedUser')
  // const navigate = useNavigate()

  
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
    
    console.log("request message: "+response); 
    if (response=='allowed') {
      setSearch(true)
      setAccess(false)
    }
    else{
      setAllowText('Request on hold')
      setTimeout(() => {
        setRequest(false)
        setSide(false)
        navigate('/doctors/requests')
      }, 5000);
    }
  }

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
 if (response.includes('Already')) {
   setIsopen(true) 
  setTimeout(() => {
    setIsopen(false)
    setRequest(false)
    setSide(false)
    navigate('/doctors/requests') 
    setPop('')
  }, 2000);
  setAllowText('Request on hold')
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
 
 
  return   <div className=" md:px-9 lg:px-11">
  <div className=" flex justify-center text-black">
        <div className={`popup ${isOpen ? 'active' : 'hide'} ${popup.includes('feilds') || popup.includes('Please') || popup.includes('Invalid') || popup.includes('email') || popup.includes('down') ? 'bg-red-400 p-2 h-11' : ' bg-orange-200'} flex justify-center text-center w-80 shadow-lg   rounded-lg font-medium text-lg fixed top-4 h-11 p-1`}>{popup}</div>  
  </div>
  <div className=''>
    {request?<div>
  <div className=" text-lg ml-2 md:ml-4 lg:ml-5 font-medium">
    username
  </div>
    <div id="reports" className={`flex justify-between  border-2 shadow-slate-500 rounded-md mt-2 px-1 md:px-5 lg:px-5 bg-white`}>  
 <div className="mt-1 font-medium ">

  <div className="flex mt-3 text-slate-800 text-md items-center" >
    <div className=" scale-75 md:scale-100 lg:scale-100 bg-slate-300 rounded-full p-2">
<User size={32}/>
    </div>
    <div className=" md:ml-3 lg:ml-3 text-sm md:text-base lg:text-base"> 
      {username?username?.charAt(0).toUpperCase()+ username.slice(1):''} 
    </div>
  </div> 
  <div className=" ml-14 text-md font-normal">
    {allowText} 
  </div>
</div> 
 <div className=" scale-75 md:scale-100 lg:scale-100 flex justify-center cursor-pointer md:transition lg:transition duration-200 ease-in-out transform md:hover:scale-95 lg:hover:scale-95 h-full md:mr-2 lg:mr-2 md:ml-4 lg:ml-4"> 
  
  <Button height={11} loader={''} onclick={()=> { 
    grantAccess()
    // window.open(`${content}`,'_blank', 'noreferrer')
    }} label={view?'view':'Request?'}></Button>
 
 </div>
</div>
    </div>:
    <div>
      <div onClick={()=>window.location.reload()} className=" flex justify-center font-medium cursor-pointer transition duration-200 ease-in-out transform hover:scale-105">
        Search new patient 
        <div className=" ml-4">
          <Search/>
          </div>
      </div>
      <div  className=" flex justify-center -mt-24">
      <img width={450} src="https://pub-f7df8bb286174a36bc558870137a7fb7.r2.dev/Search-cuate.png" alt="" />
      </div>
      </div>}
  </div>
  </div>   

}

}
