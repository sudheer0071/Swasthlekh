import { useState } from "react"
import { BottomWarn } from "../../components/BottomWarn"
import { Button } from "../../components/Button" 

import { Heading } from "../../components/Heading"
import { InputBox } from "../../components/InputBox"
import { SubHeading } from "../../components/SubHeading"
import axios from 'axios'
import { useNavigate } from "react-router-dom"
import { BACKEND_URL } from "../config"
import { load,navState } from "../atom"
import { useRecoilState } from "recoil" 
  

export function Signup(){
  const [firstname, setFirstname]= useState("")
const [lastname, setLastname]=useState("")
const [username, setUsername] = useState("")
const [password, setPassword] = useState("")
const [popup, setPopup] = useState("")
const [isOpen, setIsopen] = useState(false)
const [logged, setLogged] = useRecoilState(navState)
const [loader, setLoader] = useRecoilState(load)
// const [isbackendDown, setIsbackDown] = useRecoilState(backendDown)
const navigate = useNavigate()

return <div className="bg-slate-300 h-screen flex justify-center">
  <div className="flex flex-col justify-center">
  <div className="px-4 bg-white w-96 text-zinc-950 text-center rounded-lg h-max p-2">
     
  <div className={`popup ${isOpen ? 'active' : 'hide'} ${popup.includes('feilds') || popup.includes('already')|| popup.includes('email')||popup.includes('more')?'bg-red-400 p-2 h-16': ''} flex justify-center text-center w-80 shadow-lg bg-green-500 rounded-lg font-medium -ml-4 text-lg fixed top-4 h-11 p-1`}>{popup}
  </div>
   <Heading text={"Sign up"}></Heading>
   <SubHeading text={"Enter your information to create an account"}></SubHeading>
 
   <InputBox placeholder={"Enter First name"} value={firstname} onChange={(e:any)=>{setFirstname(e.target.value)}} label={"First name"}></InputBox>
   <InputBox placeholder={"Enter Last name"} value={lastname} onChange={(e:any)=>{setLastname(e.target.value)}}  label={"Last name"}></InputBox>
   <InputBox placeholder={"Enter Email"} value={username} onChange={(e:any)=>{setUsername(e.target.value)}}  label={"Email"}></InputBox>
   <InputBox password={true} placeholder={"Password name"} value={password} onChange={(e:any)=>{setPassword(e.target.value)}}  label={"Password"}></InputBox>

   <Button height={12} onclick={async ()=>{
     console.log(logged);
     
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
          http://localhost:5000/api/v3/users/signup
          setLoader('signup')
          const res = await axios.post(`${BACKEND_URL}/api/v3/users/signup`,
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
            navigate('/users/home')
          }, 3000);
          localStorage.setItem("TOKEN", res.data.token)
          localStorage.setItem('firstname',firstname)
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
        navigate('/users/backendDown')
        console.log("inside sighup catch")
       }, 3500);
    }
      
    }
     
   }} loader={loader} label={"Sign up"}></Button> 
    <BottomWarn label={"Already have an account?"} link={"/users/signin"} linktext={"Sign In"}></BottomWarn>
    </div> 
</div>
  </div>
}