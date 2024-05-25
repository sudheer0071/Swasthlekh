import { SideBar } from "../../New-components/Sidebar"
import { Home } from "./Home"

export const MainPage = ()=>{
  return <div>
    <div className=" h-screen">
    <SideBar user="" name={localStorage.getItem('firstname')||''} />
    </div>
     <div>
     <Home/>
     </div>
  </div>
}