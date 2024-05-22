import { useState } from "react"
import { BottomWarn } from "../../components/BottomWarn"
import { Button } from "../../components/Button"
import { Heading } from "../../components/Heading"
import { InputBox } from "../../components/InputBox"
import { SubHeading } from "../../components/SubHeading"
import axios from 'axios'
import { useNavigate } from "react-router-dom"
import { load, navState } from "../atom"
import { useRecoilState } from "recoil"
import { BACKEND_URL } from "../config"
export function Signin() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [popup, setPopup] = useState("")
  const [isOpen, setIsopen] = useState(false)
  const [logged, setLogged] = useRecoilState(navState)
  const [loader, setLoader] = useRecoilState(load)
  const [emptyEmail, setEmtpyemail] = useState(false)
  const [emptyPass, setEmtpypass] = useState(false)

  const navigate = useNavigate()

  console.log(logged, setEmtpyemail, setEmtpypass);


  return <div className=" overflow-hidden">
    <div className=" flex justify-center">
      <div className={`popup ${isOpen ? 'active' : 'hide'} ${popup.includes('feilds') || popup.includes('exist') || popup.includes('Invalid') || popup.includes('email') || popup.includes('down') ? 'bg-red-400 p-2 h-16' : ''} flex justify-center text-center w-96 shadow-lg bg-green-500 rounded-lg font-medium text-lg fixed top-4 h-11 p-1`}>{popup}</div>
    </div>
    <div className=" -mr-10 lg:ml-96">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1175 263" fill="black" className="abs hero-backgroundImage top right primary-3"><path d="M470 96.1505C285.24 111.849 142.033 74.7745 0 0H1175V263C862.527 210.142 1128.96 40.1598 470 96.1505Z" fill="#831a4a"></path></svg>
    </div>
    <div className=" flex justify-start -mt-10 sm:-mt-16 md:-mt-32 lg:-mt-56">
      <div className=" font-mono font-bold text-5xl sm:text-5xl md:text-6xl lg:text-7xl ml-8">
        <a href="/">
          Swasth<p className=" inline text-pink-500">लेख</p>
        </a>
      </div>
    </div>
    <div className="flex justify-between py-14 lg:px-40 lg:py-20">
      <div className="flex flex-col justify-center w-full">
        <div className="px-4 max-w-xl text-zinc-950 text-center rounded-lg p-2">
          <Heading text={"Sign in"}></Heading>
          <SubHeading text={"Enter your information to access an account"}></SubHeading>

          <InputBox empty={emptyEmail} placeholder={"Enter Email"} value={username} onChange={(e: any) => { setUsername(e.target.value) }} label={"Email"}></InputBox>
          <InputBox empty={emptyPass} password={true} placeholder={"Enter Password"} value={password} onChange={(e: any) => { setPassword(e.target.value) }} label={"Password"}></InputBox>
          <div className=" mt-4">
            <Button height={12} onclick={async () => { 
              if (password == '' || username == '') {
                setTimeout(() => {
                  setPopup("")
                  setIsopen(false)
                }, 3000);
                setIsopen(true)
                //********************************** will set shake inputs **********************************
                // setEmtpyemail(true)
                setPopup("Please enter all feilds")
              }
              else {
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
                    console.log("localstorage: "+localStorage.getItem('sign'));
                    
                    navigate('/users/home')
                  }, 3000);
                  setIsopen(true)
                  setPopup(json)
                  localStorage.setItem("TOKEN", res.data.token)
                  localStorage.setItem("firstname", res.data.firstname)
                }

                else {
                  setTimeout(() => {
                    setIsopen(false)
                    setLoader('')
                    setPopup('')
                  }, 2000);
                  setIsopen(true)
                  setPopup(json)
                }
              }

            }} label={"Sign in"} loader={loader}></Button>
          </div>
          <BottomWarn label={"No Accout?"} link={"/user/portal/signup"} linktext={"Sign up"}></BottomWarn>
        </div>
      </div>
      <div className=" hidden sm:hidden md:hidden lg:flex">
        <img width={834} height={343} src="https://pub-f7df8bb286174a36bc558870137a7fb7.r2.dev/My%20password-amico.png" alt="" />
      </div>
    </div>
  </div>
}