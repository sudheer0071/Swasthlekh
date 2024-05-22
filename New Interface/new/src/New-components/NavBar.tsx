import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";

export const NavBar = ()=>{
  const [menu, setMenu] = useState(false)

  const navigate = useNavigate();
  const handleUserClick = () => { 
    navigate('/user/portal/signup');
  };
  const handleUserClickLogin = () => { 
    navigate('/user/portal/signin');
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

  return <div className=" flex justify-between p-5 text-white border-b-2 border-slate-200 bg-stone-800 ">
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
      <button onClick={handleUserClick} className="btn hidden rounded-full px-12 py-4 text-md font-bold hover:bg-pink-500 transition-colors duration-700  lg:flex text-black">Join Now</button>
      </div>
      <div className={` font-mono font-thin px-0 md:px-10 text-xl flex`}> 
        <button onClick={handleUserClickLogin} >{menu?'MENU':'LOG IN'}</button>
      </div>
    </div>
  </div>
}