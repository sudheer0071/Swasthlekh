import axios from "axios" 
import { BACKEND_URL } from "../config"
import { useEffect, useState } from "react"  
import { ClipboardMinus, RefreshCcw } from "lucide-react"
import { useRecoilState } from "recoil"
import { log } from "../atom"


export function History() {
  const [popup, setPopup] = useState("")
  const [isOpen, setIsopen] = useState(false)
  const [loader, setloader] = useState('') 
  const [logs, setLogs] = useState([])
  const [side, setSide] = useRecoilState(log)
   setSide(true)
  const fetchLogs = async () => {
    console.log(loader,+side);
    
    console.log("function called");
    setloader('refresh')
    setIsopen(true)
    setPopup("Refreshing logs")
    console.log(localStorage.getItem('docToken')); 
    const res = await axios.get(`${BACKEND_URL}/api/v3/doctors/viewed`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('docToken')
      }
    });

    const response = res.data.viewed
    setTimeout(() => {
      setIsopen(false)
      setPopup('')
      setloader('')
    }, 2000);
    setPopup('Logs Refreshed')
    console.log(response);
    setLogs(response)
  }

  useEffect(() => {
    fetchLogs()
  }, [])

  return <div>
    <div className="flex flex-col p-3 md:p-4 lg:p-5 md:-mt-20 lg:-mt-20">
      <div className="flex justify-center">
        <div className={`popup ${isOpen ? 'active' : 'hide'} $flex flex-col text-center w-96 shadow-lg bg-orange-200 rounded-lg font-medium text-lg fixed top-4 h-11 p-1`}>{popup}
        </div>
      </div>
      <div className=" fl ex justify-between">
        <div>
          <div className=" text-2xl -mt-2 md:text-4xl lg:text-4xl md:-mt-12 lg:-mt-20 font-semibold">
            Your History
          </div>
          <div className=" max-w-xl mt-6">
             History of past patients that you have accessed and view reports and time when you accessed.
          </div>
        </div>
        <div onClick={fetchLogs} className=" -mt-5 md:mt-1 lg:mt-0 absolute right-2 md:right-8 lg:right-10 flex hover:bg-orange-100 p-2 rounded-md cursor-pointer">
          <div className="  md:mr-2 lg:mr-3 md:text-lg lg:text-lg font-medium">
            Refresh
          </div>
          <div className="  scale-75 md:scale-100 lg:scale-100 ">
          <RefreshCcw size={30} />
          </div>
        </div>
      </div>
      <div className=" mt-1">
        {logs.length == 0 ? (<div>
          <div id="reports-listt" className=" p-2 md:p-4 lg:p-4 rounded-lg shadow-lg h-64  md:h-80 lg:h-80  " >
            <h1 className="flex justify-center mt-20 text-4xl">

              You have no history of any patient
            </h1>
          </div>
        </div>) : (
          <div>

            <div className=" ">
              {/* <LogCard/> */}
              {logs.map((log: any, key: any) => (
                <Users key={key} user={log.user} date={log.date} accessedFiles={log.accessedFiles}></Users>
              ))}
            </div>
          </div>
        )}

      </div>
      <div className=" flex justify-center">
    <div className={`fixed -z-50 bottom-0 flex justify-center ${logs.length!=0?'opacity-55':''} `}>
      <img width={390} src="https://pub-f7df8bb286174a36bc558870137a7fb7.r2.dev/Consent-amico.png" alt="" />
    </div>
</div>
    </div>
  </div>
}


function Users({ user,date, accessedFiles }: any) {
  return <div>
    <div className=" text-lg font-medium py-3">
      Files that you accessed of patient with username: 
      <div className=" inline-block bg-custom">
      <div className=" font-mono text-xl inline-block text-orange-800">"{user}" </div> on <div className=" ml-1 inline-block text-orange-600 font-mono"> "{date}"</div>
      </div>
    </div>
    <div id="report-section" className="scrol-report overflow-x-hidden overflow-y-scroll max-h-80 rounded-md shadow-md border py-3 px-1 md:px-4 lg:px-4 bg-white">
      <div className=" ml-2 md:p-2 lg:p-2 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 justify-between">
        <div className=" flex">
          <div className="font-semibold md:font-bold lg:font-bold w-36">
            File Name
          </div>
        </div>
        <div className="hidden md:flex lg:flex  rounded-full items-center">
          <div className=" font-bold ml-3">
            Type
          </div>
        </div>
        <div className=" flex flex-col">
          <div className=" font-semibold md:font-bold lg:font-bold">
            Accessed Date  
          </div>
        </div>
        <div className="hidden md:flex lg:flex  font-bold flex-col">
          <div>
            Actions
          </div>
        </div>
        <div className=" flex px-2">
          <div>
          </div>
          <div className=" ml-7">
          </div>
        </div>
      </div>
      <div id="reports-listt" className="scrol-report overflow-x-hidden overflow-y-scroll max-h-60 rounded-md shadow-md border mt-1 md:px-4 lg:px-4 bg-white">
        {accessedFiles.map((file: any) => (
          <Files filename={file.filename} date={file.date} actions={file.actions} />
        ))}

      </div>

    </div>
  </div>
}

// function Files({ filename, date, actions }: any) {
//   return <div id="reports" className="flex justify-between shadow-md shadow-slate-500 rounded-md mt-2 py-2 bg-slate-300 group  hover:bg-slate-400">
//     <div className="flex -ml-9 mt-2 ">
//       <div className=" h-12 w-12 p-4 mr-14 mt-1 ">
//         <svg className="-mt-8" width="100px" height="80px" viewBox="-2.4 -2.4 28.80 28.80" fill="none" xmlns="http://www.w3.org/2000/svg" transform="rotate(0)" stroke="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="#CCCCCC" stroke-width="0.288"></g><g id="SVGRepo_iconCarrier"> <path d="M9 17H15M9 13H15M9 9H10M13 3H8.2C7.0799 3 6.51984 3 6.09202 3.21799C5.71569 3.40973 5.40973 3.71569 5.21799 4.09202C5 4.51984 5 5.0799 5 6.2V17.8C5 18.9201 5 19.4802 5.21799 19.908C5.40973 20.2843 5.71569 20.5903 6.09202 20.782C6.51984 21 7.0799 21 8.2 21H15.8C16.9201 21 17.4802 21 17.908 20.782C18.2843 20.5903 18.5903 20.2843 18.782 19.908C19 19.4802 19 18.9201 19 17.8V9M13 3L19 9M13 3V7.4C13 7.96005 13 8.24008 13.109 8.45399C13.2049 8.64215 13.3578 8.79513 13.546 8.89101C13.7599 9 14.0399 9 14.6 9H19" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
//       </div>
//       <div className="mt-1 font-medium ">
//         <div className="flex text-slate-900" >
//           {filename}
//           {/* {report.filename.charAt(0).toUpperCase()+ report.filename.slice(1)}  */}
//         </div>


//         <p id="date-text" className="flex text-slate-500 group-hover:text-slate-500">{actions} on: {date}
//           {/* {report.date.split(' G')[0]} */}
//         </p>
//       </div>
//     </div>
//     {/* <div className="flex justify-center h-full mr-2 ml-4">
//   <Button height={11} loader={''} onclick={()=> {
//     // localStorage.setItem('viewFile',report.filename) 
//     // window.open(`${content}`,'_blank', 'noreferrer')
//     }} label={"View on Blockhain"}></Button> 
//  </div> */}
//   </div>
// }

export const Files = ({ filename, date, actions }: any) => {

  return <div className=" grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 border-b-2 p-1 md:p-2  lg:p-2 justify-between">
    <div className=" md:ml-0 lg:ml-0 flex">
      <div className=" -mt-1 md:mt-0 lg:mt-0 scale-75 md:scale-100 lg:scale-100 ">
        <ClipboardMinus />
      </div>
      <div className=" text-sm md:text-base lg:text-base ml-2 font-mono ">
        {filename.split('.')[0]}
      </div>
    </div>
    <div className="hidden md:flex lg:flex  rounded-full items-center">
      <div className=" px-2 bg-orange-100 font-bold text-orange-800">
        PDF
      </div>
    </div>
    <div className=" flex flex-col">
      <div className="hidden md:inline lg:inline  font-medium">
        Viewed at
      </div>
      <div className="text-sm md:text-base font-light">
        {date.split(' G')[0]}
      </div>
    </div>
    <div className="   hidden md:inline lg:inline fles flex-col ml-3">
      <div>
        {actions.length == 0 ? 'Viewed' : actions}
      </div>
    </div>
    <div className=" flex">
      <div className="hover:bg-orange-100 cursor-pointer items-center px-2">

      </div>
      <div className=" ml-7 cursor-pointer">
        <div className=" hover:bg-orange-100 px-2">

        </div>
      </div>
    </div>
  </div>
}