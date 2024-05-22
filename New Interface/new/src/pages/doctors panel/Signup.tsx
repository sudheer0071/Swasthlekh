import { useState } from "react"
import { BottomWarn } from "../../components/BottomWarn"
import { Button } from "../../components/Button"

import { Heading } from "../../components/Heading"
import { InputBox } from "../../components/InputBox"
import { SubHeading } from "../../components/SubHeading"
import axios from 'axios'
import { useNavigate } from "react-router-dom"
import { BACKEND_URL } from "../config"
import { load, navState } from "../atom"
import { useRecoilState } from "recoil"


export function Signup() {
  const [firstname, setFirstname] = useState("")
  const [lastname, setLastname] = useState("")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [popup, setPopup] = useState("")
  const [isOpen, setIsopen] = useState(false)
  const [logged, setLogged] = useRecoilState(navState)
  const [loader, setLoader] = useRecoilState(load)
  // const [isbackendDown, setIsbackDown] = useRecoilState(backendDown)
  const navigate = useNavigate()
 console.log(logged);
 
  return <div className=" overflow-hidden">
    <div className=" flex justify-center">
      <div className={`popup ${isOpen ? 'active' : 'hide'} ${popup.includes('feilds') || popup.includes('already') || popup.includes('email') || popup.includes('more') ? 'bg-red-400 p-2 h-16' : ''} flex justify-center text-center w-80 shadow-lg bg-green-500 rounded-lg font-medium -ml-4 text-lg fixed top-4 h-11 p-1`}>{popup}
      </div>
    </div>
    <div className="-mr-10 lg:ml-96">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1175 263" fill="black" className="abs hero-backgroundImage top right primary-3"><path d="M470 96.1505C285.24 111.849 142.033 74.7745 0 0H1175V263C862.527 210.142 1128.96 40.1598 470 96.1505Z" fill="#831a4a"></path></svg>
    </div>
    <div className=" flex justify-start -mt-20 sm:-mt-20 md:-mt-32 lg:-mt-52">
      <div className=" font-mono font-bold text-5xl sm:text-5xl md:text-6xl lg:text-7xl ml-8">
        <a href="/">
          <p className=" inline-grid mt-2">Swasth</p><p className=" inline text-pink-500">लेख</p>
        </a>
      </div>
    </div>
    <div className="flex justify-between -py-2 lg:px-40 lg:py-6">
      <div className="flex flex-col justify-center w-full">
      <div className="px-4 max-w-xl text-zinc-950 text-center rounded-lg p-2">
     
      <Heading text={"Sign up"}></Heading>
      <SubHeading text={"Enter your information to create an account"}></SubHeading>
    
      <InputBox placeholder={"Enter First name"} value={firstname} onChange={(e:any)=>{setFirstname(e.target.value)}} label={"First name"}></InputBox>
      <InputBox placeholder={"Enter Last name"} value={lastname} onChange={(e:any)=>{setLastname(e.target.value)}}  label={"Last name"}></InputBox>
      <InputBox placeholder={"Enter Email"} value={username} onChange={(e:any)=>{setUsername(e.target.value)}}  label={"Email"}></InputBox>
      <InputBox password={true} placeholder={"Password name"} value={password} onChange={(e:any)=>{setPassword(e.target.value)}}  label={"Password"}></InputBox>
   
      <Button height={12} onclick={async ()=>{
        
        if (firstname==''||lastname==''||password==''||username=='') { 
          console.log('ssssffs');
          setTimeout(() => { 
            setPopup("")
            setIsopen(false)
           }, 3000);
           setIsopen(true)
           setPopup("Please enter all feilds")
         }
         else{
           try { 
             setLoader('signup')
             const res = await axios.post(`${BACKEND_URL}/api/v3/doctors/signup`,
         {
           firstname, lastname, username, password
          })
          const json = res.data.message 
          if (json.includes('successfully')) { 
             setTimeout(() => { 
               setIsopen(false)
               setFirstname("")
               setLastname("")
               setPassword("")
               setUsername("")
               setLoader('')
               setPopup('')
               setLogged(true)
               navigate('/doctors/home')
             }, 3000);
             localStorage.setItem("docToken", res.data.token)
             localStorage.setItem('docFirstname',firstname)
             setIsopen(true)
             setPopup(json)
             console.log(res.data.token);
           }
           else{
             setTimeout(() => { 
               setIsopen(false) 
               setUsername('')
               setLoader('')
               setPopup('') 
             }, 3000); 
             setIsopen(true)
             setPopup(json) 
           }
         } catch (error) {
          setTimeout(() => {
           // setIsbackDown(true)
           navigate('/doctors/backendDown')
           console.log("inside sighup catch")
          }, 3500);
       }
         
       }
        
      }} loader={loader} label={"Sign up"}></Button> 
       <BottomWarn label={"Already have an account?"} link={"/doctor/portal/signin"} linktext={"Sign In"}></BottomWarn>
       </div> 

      </div>
      <div className="hidden sm:hidden md:hidden lg:flex">
        <img width={834} height={343} src="https://pub-f7df8bb286174a36bc558870137a7fb7.r2.dev/Forms-cuate.png" alt="" />
      </div>
    </div>
  </div>
}