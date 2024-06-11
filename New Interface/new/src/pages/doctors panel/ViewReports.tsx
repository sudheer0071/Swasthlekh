 
import { Reports } from "../../components/Reports" 
export const ViewReport = ()=>{
  return <div className=" px-1 md:px-9 lg:px-10">
    <div className=" text-2xl md:text-4xl lg:text-4xl font-medium  md:px-4 md:-mt-28 lg:-mt-36 lg:px-5">
      Reports from Patient
    </div>
    <div className=" mt-10 md:mt-16 lg:mt-20 text-xl md:text-3xl lg:text-3xl px-1 md:px-5 lg:px-5">
      All reports of patient with email <div className=" inline-block text-orange-700 navbar rounded-md p-1 px-2 font-mono">`{localStorage.getItem('currentUser')}`</div>
    </div>
    <div className=" mt-5">
    <Reports hide={true} white={true} token={localStorage.getItem('docToken')} username={localStorage.getItem('currentUser')}/>
    </div> 
  </div>
}