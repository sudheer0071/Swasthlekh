import { useEffect, useState } from "react"
import { Button } from "./Button"
import axios from "axios" 
import { useNavigate } from "react-router-dom"
import { BACKEND_URL } from "../config"
 
  
export function Reports() {
  console.log(localStorage.getItem("TOKEN"));
  const [report, setReport] = useState<any>([]); 

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await axios.post(
          `http://localhost:3000/api/v3/users/reports`,
          {},
          {
            headers: {
              'Content-Type': 'application/pdf',
              'Authorization': 'Bearer ' + localStorage.getItem('TOKEN')
            }
          }
        );
        const allReports = res.data.filename;   
        setReport(allReports); 
      } catch (error) {
        console.error('Error fetching reports:', error);
      }
    }
    fetchData();
  }, []);  
console.log(report);  
  return (
    <div>
      <div className="my-2">
        {/* { (report)} */}
      {report.map((report:any, index:any)=><Reps key={index} report={report}></Reps>)}
      </div>
    </div>
  )
}
function Reps({report}:any){
  
  const navigate = useNavigate()

  return  <div className="flex justify-between border shadow-md rounded-md mt-1 bg-slate-500 hover:bg-slate-700  ">
  <div className="flex -ml-9 mt-2 "> 
<div className=" h-12 w-12 p-4 mr-14 mt-1 ">
<svg className="-mt-8" width="100px" height="80px" viewBox="-2.4 -2.4 28.80 28.80" fill="none" xmlns="http://www.w3.org/2000/svg" transform="rotate(0)" stroke="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="#CCCCCC" stroke-width="0.288"></g><g id="SVGRepo_iconCarrier"> <path d="M9 17H15M9 13H15M9 9H10M13 3H8.2C7.0799 3 6.51984 3 6.09202 3.21799C5.71569 3.40973 5.40973 3.71569 5.21799 4.09202C5 4.51984 5 5.0799 5 6.2V17.8C5 18.9201 5 19.4802 5.21799 19.908C5.40973 20.2843 5.71569 20.5903 6.09202 20.782C6.51984 21 7.0799 21 8.2 21H15.8C16.9201 21 17.4802 21 17.908 20.782C18.2843 20.5903 18.5903 20.2843 18.782 19.908C19 19.4802 19 18.9201 19 17.8V9M13 3L19 9M13 3V7.4C13 7.96005 13 8.24008 13.109 8.45399C13.2049 8.64215 13.3578 8.79513 13.546 8.89101C13.7599 9 14.0399 9 14.6 9H19" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
  </div>
 <div className="mt-1 font-medium">
  <div > 
  {report.charAt(0).toUpperCase()+ report.slice(1)} 
  </div>
  <p className="flex ">uploaded on: {}</p>
 </div>
</div>
 <div className="flex flex-col justify-center h-full mr-2">
  <Button loader={''} onclick={(e)=> {navigate('/send?id='+report._id+'&name='+report.firstname)}} label={"Open"}></Button>
 </div>
</div>
}
