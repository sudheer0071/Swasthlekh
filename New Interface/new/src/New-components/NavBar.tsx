import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../components/ui/alert-dialog"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu"


export const NavBar = ()=>{
  const [menu, setMenu] = useState(false)

  const navigate = useNavigate();
  const handleUserClick = () => { 
    navigate('/user/portal/signup');
  };
  const handleDoctorClick = () => { 
    navigate('/doctor/portal/signup');
  };
  const handleUserClickLogin = () => { 
    navigate('/user/portal/signin');
  };
  const handleDoctorClickLogin = () => { 
    navigate('/doctor/portal/signin');
  };


  useEffect(()=>{
    const handleResize = () =>{
      if (window.innerWidth >=1024) {
        setMenu(false)
      }else{
        setMenu(true)
      }
    }
    handleResize()

    window.addEventListener('resize', handleResize)
    return () =>{window.addEventListener('resize', handleResize)}
  },[])

  return <div className=" flex justify-between z-50 p-5 text-white border-b-2 border-slate-200 bg-stone-800 ">
    <div className=" flex justify-between">
      <div className=" font-bold font-mono text-4xl md:text-5xl ml-8 mt-3">
        <a href="/">
      Swasth<p className=" inline text-pink-500">लेख</p>
        </a>
      </div>
      <div className=" items-center hidden md:flex text-3xl px-6">
        Care ^
      </div>
    </div>
    <div  className="flex justify-between mr-8">
    <div className="hidden font-mono px-10 text-xl font-thin lg:flex">
        <button>THE MOTIVE</button>
      </div>
      <div >
     
      <AlertDialog>
  <AlertDialogTrigger className="btn hidden rounded-full px-12 py-4 text-md font-bold hover:bg-pink-500 transition-colors duration-700  lg:flex text-black">Join Now</AlertDialogTrigger>
  <AlertDialogContent> 
    <AlertDialogHeader>
      <AlertDialogTitle>
        <div className=" flex">
          <div>
            <div className="border-8 border-white rounded-md">
            <img width={400} src="https://pub-f7df8bb286174a36bc558870137a7fb7.r2.dev/Doctor-amico.png" alt="" />
            </div>
            <div className="mt-8 flex justify-center">
            <AlertDialogFooter> 
      <AlertDialogAction onClick={handleDoctorClick} className="">Join as a Doctor</AlertDialogAction>
    </AlertDialogFooter>
            </div>
          </div>
          <div className="">
            <div className=" ml-10 border-8 border-white rounded-md">
            <img width={400} className="" src="https://pub-f7df8bb286174a36bc558870137a7fb7.r2.dev/patient.png" alt="" />
            </div>
            <div className="mt-8 flex justify-center">
            <AlertDialogFooter> 
      <AlertDialogAction onClick={handleUserClick} >Join as a Patient</AlertDialogAction>
    </AlertDialogFooter>
            </div>
          </div> 
        </div> 
        </AlertDialogTitle> 
    </AlertDialogHeader> 
  </AlertDialogContent>
</AlertDialog>

      </div>
      <div className={` font-mono font-thin px-0 md:px-10 text-xl flex`}>  
        <DropdownMenu>
  <DropdownMenuTrigger>{menu?'LOG IN':'LOG IN'}</DropdownMenuTrigger> 
  <DropdownMenuContent> 
    <DropdownMenuItem onClick={handleUserClickLogin}>Patient</DropdownMenuItem>
    <DropdownMenuItem onClick={handleDoctorClickLogin} >Doctor</DropdownMenuItem> 
  </DropdownMenuContent>
</DropdownMenu>


      </div>
    </div>
  </div>
}