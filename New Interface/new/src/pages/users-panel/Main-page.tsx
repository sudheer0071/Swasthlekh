import { SideBar } from "../../New-components/Sidebar"
import { Home } from "./Home"

export const MainPage = ()=>{
  return <div>
    <div className=" h-screen">
    <SideBar name={localStorage.getItem('firstname')} />
    </div>
     <div>
     <Home/>
     </div>
  </div>
}