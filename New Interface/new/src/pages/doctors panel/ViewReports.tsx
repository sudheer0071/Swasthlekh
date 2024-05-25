 
import { Reports } from "../../components/Reports" 
export const ViewReport = ()=>{
  return <div className=" px-10">
    <div className=" text-4xl font-medium -mt-36 px-5">
      Reports from Patient
    </div>
    <div className=" mt-20 text-3xl px-5">
      All reports of patient with email <div className=" inline-block text-orange-700 navbar rounded-md p-1 px-2 font-mono">`{localStorage.getItem('currentUser')}`</div>
    </div>
    <div className=" mt-5">
    <Reports hide={true} white={true} token={localStorage.getItem('docToken')} username={localStorage.getItem('currentUser')}/>
    </div> 
  </div>
}