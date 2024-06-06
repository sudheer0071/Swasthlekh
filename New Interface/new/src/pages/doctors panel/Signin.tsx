import { useEffect, useState } from "react"
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
import { useGoogleLogin } from "@react-oauth/google"
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

   
  type userProfile = { 
    email: string,
    id: string
  }

  const [user, setUser] = useState({ access_token: '' });
  const [profile, setProfile] = useState<userProfile>({ email:'',id:''});


  const login = useGoogleLogin({
    onSuccess: (codeResponse: any) => setUser(codeResponse),
    onError: (error: any) => console.log('Login Failed:', error)
  });

  const sendReq = async () => {
    console.log("inside sendReq: ");
    console.log(profile.email);
    if (profile.email == '') {
       
    }
    else {
      const res = await axios.post(`${BACKEND_URL}/api/v3/doctors/signin`,
        { username: profile.email, password: profile.id
        })

      const response = res.data.message
      console.log("response: " + JSON.stringify(res));
if (response.includes("doesn't")) {
  setTimeout(() => {
    setIsopen(false)
    setPopup('')
  }, 2000);
  setIsopen(true)
  setPopup(response)
}
else{
  setTimeout(() => {
    setIsopen(false)
    setLoader('')
    setPopup('')
    setLogged(true)
    navigate('/doctors/home')
  }, 3000);
  localStorage.setItem("docToken", res.data.token)
  localStorage.setItem('docFname', res.data.firstname)
  localStorage.setItem('docLname', res.data.lastname)
  localStorage.setItem('docEmail', res.data.username)
  setIsopen(true)
  setPopup(response)
  console.log(res.data.token);
}
    }
  }
  useEffect(
    () => {
      async function getUser() {
        
        if (user) {
        const res = await axios
          .get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.access_token}`, {
            headers: {
              Authorization: `Bearer ${user.access_token}`,
              Accept: 'application/json'
            }
          }) 
          console.log(res.data);
            setProfile(res.data) 
            console.log(profile);  
      }
    } 
    getUser()
  },
    [user]
  );

useEffect(()=>{
  console.log(profile); 
  sendReq()
},[profile])


  return <div className=" overflow-hidden">
    <div className=" flex justify-center text-black">
      <div className={`popup ${isOpen ? 'active' : 'hide'} ${popup.includes('feilds') || popup.includes('exist') || popup.includes('Invalid') || popup.includes('email') || popup.includes('down') ? 'bg-red-400 p-2 h-16' : ' bg-orange-200 text-black'} flex justify-center text-center w-96 shadow-lg rounded-lg font-medium text-lg fixed top-4 h-11 p-1`}>{popup}</div>
    </div>
    <div className="-mr-10 lg:ml-96">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1175 263" fill="black" className="abs hero-backgroundImage top right primary-3"><path d="M470 96.1505C285.24 111.849 142.033 74.7745 0 0H1175V263C862.527 210.142 1128.96 40.1598 470 96.1505Z" fill="#831a4a"></path></svg>
    </div>
    <div className=" flex justify-start -mt-14 sm:-mt-16 md:-mt-32 lg:-mt-56">
      <div className=" font-mono font-bold text-5xl sm:text-5xl md:text-6xl lg:text-7xl ml-8">
        <a href="/">
          Swasth<p className=" inline text-pink-500">लेख</p>
        </a>
      </div>
    </div>
    <div className="flex justify-between py-4 lg:px-40 lg:py-20">
      <div className="flex flex-col justify-center w-full">
      <div className="px-4 max-w-xl text-zinc-950 text-center rounded-lg p-2"> 
   
   <Heading text={"Sign in"}></Heading>
   <SubHeading text={"Enter your information to access an account"}></SubHeading>
 
   <InputBox empty={emptyEmail} placeholder={"Enter Email"} value={username} onChange={(e:any)=>{setUsername(e.target.value)}}  label={"Email"}></InputBox>
   <InputBox empty={emptyPass} password={true} placeholder={"Enter Password"} value={password} onChange={(e:any)=>{setPassword(e.target.value)}}  label={"Password"}></InputBox>
   <Button height={12} onclick={async ()=>{
     
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
        setLoader('signin') 
        const res = await axios.post(`${BACKEND_URL}/api/v3/doctors/signin`,
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
              navigate('/doctors/home')
            }, 3000);
            setIsopen(true)
          setPopup(json)
          localStorage.setItem("docToken", res.data.token)
          localStorage.setItem('docFname', res.data.firstname)
          localStorage.setItem('docLname', res.data.lastname)
          localStorage.setItem('docEmail', res.data.username)
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
   <BottomWarn label={"No Accout?"} link={"/doctor/portal/signup"} linktext={"Sign up"}></BottomWarn>
   or
        <div className=" mt-2 flex justify-center"> 
          <div className=" flex p-1 bg-white px-5 text-lg">
          <div className="">
          <svg aria-hidden="true" className="native svg-icon iconGoogle" width="18" height="18" viewBox="0 0 18 18">
            <path fill="#4285F4" d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 0 0 2.38-5.88c0-.57-.05-.66-.15-1.18"></path><path fill="#34A853" d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2a4.8 4.8 0 0 1-7.18-2.54H1.83v2.07A8 8 0 0 0 8.98 17"></path><path fill="#FBBC05" d="M4.5 10.52a4.8 4.8 0 0 1 0-3.04V5.41H1.83a8 8 0 0 0 0 7.18z"></path><path fill="#EA4335" d="M8.98 4.18c1.17 0 2.23.4 3.06 1.2l2.3-2.3A8 8 0 0 0 1.83 5.4L4.5 7.49a4.8 4.8 0 0 1 4.48-3.3"></path>
          </svg>
          </div>
          <div className=" ml-3 -mt-1">
          <button onClick={() => { login() }}>Sign Up with Google </button> 
          </div>
          </div>
            <br /> 
          </div>
    </div> 
      </div>
      <div className="hidden sm:hidden md:hidden lg:flex">
        <img width={834} height={343} src="https://pub-f7df8bb286174a36bc558870137a7fb7.r2.dev/My%20password-amico.png" alt="" />
      </div>
    </div>
  </div>
}