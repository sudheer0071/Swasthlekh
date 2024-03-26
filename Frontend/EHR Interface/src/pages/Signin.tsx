import { useState } from "react"
import { BottomWarn } from "../components/BottomWarn"
import { Button } from "../components/Button"
import { Heading } from "../components/Heading"
import { InputBox } from "../components/InputBox"
import { SubHeading } from "../components/SubHeading"
import axios from 'axios'
import {useNavigate } from "react-router-dom"
import { load, navState } from "../atom"
import { useRecoilState } from "recoil"
import { BACKEND_URL } from "../config"
export function  Signin(){
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [popup, setPopup] = useState("")
  const [isOpen, setIsopen] = useState(false) 
  const [logged, setLogged] = useRecoilState(navState)
  const [loader, setLoader] = useRecoilState(load)
  const [emptyEmail, setEmtpyemail] = useState(false)
  const [emptyPass, setEmtpypass] = useState(false)

  const navigate = useNavigate()
  

  return <div className="bg-gray-500 h-screen flex justify-center">
  <div className="flex flex-col justify-center">
  <div className="px-4 bg-white w-80 text-zinc-950 text-center rounded-lg h-max p-2"> 
  <div className={`popup ${isOpen ? 'active' : 'hide'} ${popup.includes('feilds') || popup.includes('exist')||popup.includes('Invalid')||popup.includes('email')?'bg-red-400 p-2 h-16': ''} flex justify-center text-center w-80 shadow-lg bg-green-500 rounded-lg -ml-4 font-medium text-lg fixed top-4 h-11 p-1`}>{popup}</div>
   <Heading text={"Sign in"}></Heading>
   <SubHeading text={"Enter your information to access an account"}></SubHeading>
 
   <InputBox empty={emptyEmail} placeholder={"Enter Email"} value={username} onChange={(e:any)=>{setUsername(e.target.value)}}  label={"Email"}></InputBox>
   <InputBox empty={emptyPass} password={true} placeholder={"Enter Password"} value={password} onChange={(e:any)=>{setPassword(e.target.value)}}  label={"Password"}></InputBox>
   <Button  onclick={async ()=>{
     
     if (password==''||username=='') {  
       setTimeout(() => { 
         setPopup("")
         setIsopen(false)
        }, 3000);
        setIsopen(true)
        //********************************** will set shake inputs **********************************
        // setEmtpyemail(true)
        setPopup("Please enter all feilds")
      }
      else{
        
        // const res = await axios.post('http://localhost:3000/api/v3/users/signin',{
        //   username, password
        // })
        // console.log(res.data.message);
        
        setLoader('signin') 
        const res = await axios.post(`${BACKEND_URL}/api/v3/users/signin`,
      {
          username, password
       })
       const json = res.data.message
          console.log("inside signin");
          if (json.includes('details')) {
            setTimeout(() => { 
              setIsopen(false) 
              setPassword("")
              setUsername("")
              setPopup('')
              setLoader('')
              setLogged(true)
              navigate('/mainpage')
            }, 3000);
            setIsopen(true)
          setPopup(json)
          localStorage.setItem("TOKEN", res.data.token) 
          localStorage.setItem("firstname", res.data.firstname)
          }

          else{
            setTimeout(() => { 
              setIsopen(false)  
              setLoader('')
              setPopup('')
            }, 2000);
            setIsopen(true)
          setPopup(json)
          }
        }
     
   }}label={"Sign in"} loader={loader}></Button>
   <BottomWarn label={"No Accout?"} link={"/signup"} linktext={"Sign up"}></BottomWarn>
    </div> 
</div>
  </div>
}