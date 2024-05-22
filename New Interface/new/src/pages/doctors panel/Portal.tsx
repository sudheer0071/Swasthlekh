import { Route, Routes } from "react-router-dom"
import { Signup } from "./Signup"
import { Signin } from "./Signin"

export const DoctorPortal = ()=>{
  return <div>
    <Routes>
    <Route path='/signup' element={<Signup />}></Route> 
          {/* <Route path='/send' element={<SendMoney />}></Route> */}
          <Route path='/signin' element={<Signin />}></Route> 
    </Routes>
  </div>
}