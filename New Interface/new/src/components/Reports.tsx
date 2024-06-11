import { useEffect, useState } from "react" 
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { BACKEND_URL } from "../pages/config"
import { useRecoilState } from "recoil"
import { actions } from "../pages/atom"
import { BotMessageSquare, ClipboardMinus, Download } from "lucide-react"
export function Reports({ hide, white, token, username }: {hide?:boolean, white?:boolean, token:any, username?:any}) {
  // console.log(localStorage.getItem("TOKEN"));
  const [report, setReport] = useState<any>([]);
  const [zero, setZero] = useState(false)
  const [popup, setPop] = useState('')
  const [isOpen, setIsopen] = useState(false)
  const [found, setFound] = useState(false)
  const [message, setMessage] = useState(false)

  if (username) {
    console.log("inside usernamee");

    useEffect(() => {
      async function fetchData() {
        setTimeout(() => {

        }, 2000);
        try {
          setIsopen(true)
          setPop('Searching')
          const res = await axios.post(
            `${BACKEND_URL}/api/v3/doctors/reports`,
            { username },
            {
              headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
              }
            }
          ); 
          const allReports = res.data;
          console.log("all reports "+allReports.message);
          
          console.log((allReports.files));
          if (allReports.message.includes("no")) {
            setTimeout(() => {
              setIsopen(false)
              setPop('')
            }, 2000);
            setMessage(allReports.message)
            setPop("User not found")
            setZero(true)
          }

          if (allReports.message.includes("associated")) {
            setTimeout(() => {
              setIsopen(false)
              setPop('')
            }, 2000);
            setMessage(allReports.message)
            setPop("No reports found")
            setZero(true)
            setFound(true)
          }

          else {
            setTimeout(() => {
              setIsopen(false)
              setPop('')
            }, 1000);
            setTimeout(() => {
              setPop(allReports.message)
            }, 2000);
            console.log("date: " + res.data.files);
            console.log("executed main fetch 1");
            setReport(allReports.files)
          }

          // if (!initialRender.current && allReports.length > report.length) {
          //   setReport(allReports);
          // } else {
          //   initialRender.current = false;
          // }
        }
        catch (error) {
          console.error('Error fetching reports:', error);
        }
      }
      fetchData();
    }, []);
  }

  else {
    useEffect(() => {
      async function fetchData() {
        try {
          console.log("inside main fetch 1");
          const res = await axios.post(
            `${BACKEND_URL}/api/v3/users/reports`,
            {},
            {
              headers: {
                'Content-Type': 'application/pdf',
                'Authorization': 'Bearer ' + token
              }
            }
          );
          const allReports = res.data
          console.log((allReports.files));

          if (allReports.message.includes("no")) {
            setTimeout(() => {
              setIsopen(false)
              setPop('')
            }, 2000);
            setMessage(allReports.message)
            setPop("User not found")
            setZero(true)
          }
          console.log("date: " + res.data.files);
          console.log("executed main fetch 1");
          setReport(allReports.files)
        } catch (error) {
          console.error('Error fetching reports:', error);
        }
      }

      fetchData();
    }, [])

  }

  console.log(report);

  return (
    <div>
      <div className="flex justify-center">
        <div className={`popup ${isOpen ? 'active' : 'hide'} ${popup.includes('exist') || popup.includes('found') || popup.includes('Invalid') || popup.includes('email') || popup.includes('down') ? 'bg-red-400 p-2 h-12' : ' bg-orange-200 text-black'} flex justify-center text-center w-80 shadow-lg rounded-lg -ml-4 font-medium text-lg fixed top-4 h-11 p-1`}>{popup} 
        </div>
      </div>
      <div className="md:my-2 lg:my-2">
        {/* <h3 className="text-slate-700">list of users</h3> */}

        {zero ? <div>
          {found ? (<div>
            <h1 className="flex justify-center text-slate-600 mt-20 text-3xl"> {message}</h1>
          </div>) :
            (<div className=" ">
              <h1 className="flex justify-center text-slate-600 text-3xl"> {message}</h1>
            <div className=" flex justify-center -mt-9">
              <img width={300} src="https://pub-f7df8bb286174a36bc558870137a7fb7.r2.dev/No%20data-amico.png" alt="" />
            </div>
            </div>)}
        </div> :
          <div>
            {username ? (
              <div className= {`${hide?'hidden':''} flex justify-center font-medium text-lg navba border-b-2`}>
                Showing reports associated with username: <div className=" text-slate-500 font-bold ml-4">"{username}"</div>
              </div>) : ''}
              <div className=" mt-1 sm:-mt-2 md:-mt-2 lg:-mt-2 sm:p-2 md:p-2 lg:p-2 flex justify-between">
                  <div className=" flex">
                    <div className=" font-semibold md:font-bold lg:font-bold ml-1 w-24 md:w-36 lg:w-36">
                      File Name
                    </div>
                  </div>
                  <div className=" rounded-full items-center hidden md:flex lg:flex">
                    <div className=" font-bold ml-3">
                      Type
                    </div>
                  </div>
                  <div className=" flex flex-col">
                    <div className=" hidden sm:inline md:inline lg:inline w-32 lg:w-full font-semibold md:font-bold lg:font-bold ml-14 md:-ml-14 lg:-ml-14">
                      Uploaded Date and Time
                    </div>
                    <div className="inline sm:hidden md:hidden lg:hidden w-32 lg:w-full font-semibold md:font-bold lg:font-bold ml-5 sm:-ml-2 md:-ml-14 lg:-ml-14">
                      Uploaded On
                    </div>
                  </div>
                  <div className=" flex px-2">
                    <div>
                    </div>
                    <div className=" ml-7">
                    </div>
                  </div>
                </div>
                <div className= {`${white?'bg-white':'bg-custom'} ml-1 sm:ml-0 md:ml-0 lg:ml-0 mt-3 border-2 rounded-md`}>
            {report.map((report: any, index: any) => <UploadCard username={username} token={token} key={index} report={report} />)}
                </div>
          </div>
        }
      </div>
    </div>
  )
}


// function Reps({ report, token, username }: any) {
//   const [action, setActions] = useRecoilState(actions)

//   { console.log("inside Report:") }
//   const [content, setContent] = useState('')
//   console.log(content);


//   async function viewdoc() {
//     var blog
//     if (username) {
//       console.log("action: " + action);

//       const res = await axios.post(
//         `${BACKEND_URL}/api/v3/doctors/pdf`,
//         {
//           filename: localStorage.getItem('viewFile'),
//           username,
//           actions: action
//         },
//         {
//           responseType: 'blob',
//           headers: {
//             'Content-Type': 'application/json',
//             'Authorization': 'Bearer ' + token
//           }
//         }
//       );
//       console.log("inside viewDoc: ");

//       blog = URL.createObjectURL(res.data);
//     }

//     else {
//       console.log("inside main fetch 2");

//       const res = await axios.post(
//         `${BACKEND_URL}/api/v3/users/pdf`,
//         { filename: localStorage.getItem('viewFile') },
//         {
//           responseType: 'blob',
//           headers: {
//             'Content-Type': 'application/json',
//             'Authorization': 'Bearer ' + token
//           }
//         }
//       );
//       console.log("inside viewDoc: ");

//       blog = URL.createObjectURL(res.data);
//     }
//     console.log("Executed main fetch 2");
//     setContent(blog)
//     window.open(`${blog}`, '_blank', 'noreferrer')
//   }
//   // async function analyze(filename:any) {
//   //   console.log("filename: "+filename);

//   //   const res = await axios.post(
//   //     `${BACKEND_URL}/api/v3/users/analdyze`,
//   //     {
//   //       userFile:filename,  
//   //   },
//   //     { 
//   //       headers: {
//   //         'Content-Type': 'application/json',
//   //         'Authorization': 'Bearer ' + token
//   //       }
//   //     }
//   //   );
//   //   console.log("inside analyze: ");
//   //   console.log(res.data.extracted);

//   // }
//   const navigate = useNavigate()

//   return <div id="reports" className="flex justify-between shadow-md shadow-slate-500 rounded-md mt-2 bg-slate-300 group hover:bg-slate-400">
//     <div className="flex -ml-9 mt-2 ">
//       <div className=" h-12 w-12 p-4 mr-14 mt-1 ">
//         <svg className="-mt-8" width="100px" height="80px" viewBox="-2.4 -2.4 28.80 28.80" fill="none" xmlns="http://www.w3.org/2000/svg" transform="rotate(0)" stroke="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="#CCCCCC" stroke-width="0.288"></g><g id="SVGRepo_iconCarrier"> <path d="M9 17H15M9 13H15M9 9H10M13 3H8.2C7.0799 3 6.51984 3 6.09202 3.21799C5.71569 3.40973 5.40973 3.71569 5.21799 4.09202C5 4.51984 5 5.0799 5 6.2V17.8C5 18.9201 5 19.4802 5.21799 19.908C5.40973 20.2843 5.71569 20.5903 6.09202 20.782C6.51984 21 7.0799 21 8.2 21H15.8C16.9201 21 17.4802 21 17.908 20.782C18.2843 20.5903 18.5903 20.2843 18.782 19.908C19 19.4802 19 18.9201 19 17.8V9M13 3L19 9M13 3V7.4C13 7.96005 13 8.24008 13.109 8.45399C13.2049 8.64215 13.3578 8.79513 13.546 8.89101C13.7599 9 14.0399 9 14.6 9H19" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
//       </div>
//       <div className="mt-1 font-medium ">
//         <div className="flex text-slate-800" >
//           {report.filename.charAt(0).toUpperCase() + report.filename.slice(1)}
//         </div>
//         <p id="date-text" className="flex text-slate-400 group-hover:text-slate-500">Uploaded on: {report.date.split(' G')[0]}</p>
//       </div>
//     </div>
//     <div className="flex justify-center h-full mr-2 ml-4">


//       <Button height={11} loader={''} onclick={() => {

//         localStorage.setItem('viewFile', report.filename)
//         setActions('Viewed')
//         viewdoc()
//         // window.open(`${content}`,'_blank', 'noreferrer')
//       }} label={"View"}></Button>

//       <div className="flex px-3">
//         <Button height={11} loader={''} onclick={() => {
//           localStorage.setItem('analyze', report.filename)
//           console.log("filename:    " + localStorage.getItem('analyze'));
//           if (username) {
//             setActions('Analyzed')
//             localStorage.setItem('userName', username)
//             navigate('/doctors/view?id=' + token);
//           } else {
//             localStorage.setItem('analyzee', report.filename)
//             localStorage.setItem('chat_token', token)
//             console.log("token 2: " + localStorage.getItem('chat_token'));

//             // analyze(localStorage.getItem('analyzee'))
//             navigate('/users/view?id=' + token);
//           }
//         }
//         } label={"Analyze"}></Button>
//       </div>
//     </div>
//   </div>
// }

export const UploadCard = ({ report, token, username }: any) => {

  const [action, setActions] = useRecoilState(actions)

  { console.log("inside Report:") }
  const [content, setContent] = useState('')
  console.log(content);


  async function viewdoc() {
    var blog
    if (username) {
      console.log("action: " + action);

      const res = await axios.post(
        `${BACKEND_URL}/api/v3/doctors/pdf`,
        {
          filename: localStorage.getItem('viewFile'),
          username,
          actions: action
        },
        {
          responseType: 'blob',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
          }
        }
      );
      console.log("inside viewDoc: ");

      blog = URL.createObjectURL(res.data);
    }

    else {
      console.log("inside main fetch 2");

      const res = await axios.post(
        `${BACKEND_URL}/api/v3/users/pdf`,
        { filename: localStorage.getItem('viewFile') },
        {
          responseType: 'blob',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
          }
        }
      );
      console.log("inside viewDoc: ");

      blog = URL.createObjectURL(res.data);
    }
    console.log("Executed main fetch 2");
    setContent(blog)
    window.open(`${blog}`, '_blank', 'noreferrer')
  }
  // async function analyze(filename:any) {
  //   console.log("filename: "+filename);

  //   const res = await axios.post(
  //     `${BACKEND_URL}/api/v3/users/analdyze`,
  //     {
  //       userFile:filename,  
  //   },
  //     { 
  //       headers: {
  //         'Content-Type': 'application/json',
  //         'Authorization': 'Bearer ' + token
  //       }
  //     }
  //   );
  //   console.log("inside analyze: ");
  //   console.log(res.data.extracted);

  // }
  const navigate = useNavigate()


  return <div className=" border-b-2 p-1 sm:p-2 md:p-2 lg:p-2 flex justify-between">
    <div className=" flex">
      <div>
        <ClipboardMinus />
      </div>
      <div className=" ml-2 font-mono w-20 text-sm md:text-base lg:text-base md:w-40 lg:w-40">
        {report.filename.split('.')[0]}

      </div>
    </div>
    <div className=" rounded-full items-center hidden md:flex lg:flex">
      <div className=" px-2 bg-orange-100 md:font-bold lg:font-bold text-orange-800">
        PDF
      </div>
    </div>
    <div className=" flex flex-col">
      <div className="hidden md:inline lg:inline font-medium">
        Uploaded on
      </div>
      <div className=" w-24 lg:w-full md:w-full  text-sm md:text-base lg:text-base font-light">
        {report.date.split(' G')[0]}
      </div>
    </div>
    <div className=" md:flex lg:flex">
      <div onClick={() => 
      {

        localStorage.setItem('viewFile', report.filename)
        setActions('Viewed')
        viewdoc()
        // window.open(`${content}`,'_blank', 'noreferrer')
      }} className=" cursor-pointer transition duration-200 ease-in-out transform hover:scale-125 items-center hover:text-black mt-2 text-gray-600 px-2">
        < Download size={20} />
      </div>
      <div onClick={() => {
        localStorage.setItem('analyze', report.filename)
        console.log("filename:    " + localStorage.getItem('analyze'));
        if (username) {
          setActions('Analyzed')
          localStorage.setItem('userName', username)
          navigate('/doctors/view?id=' + token);
        } else {
          localStorage.setItem('analyzee', report.filename)
          localStorage.setItem('chat_token', token)
          console.log("token 2: " + localStorage.getItem('chat_token'));

          // analyze(localStorage.getItem('analyzee'))
          navigate('/users/view?id=' + token);
        }
      }} className=" md:ml-7 lg:ml-7 cursor-pointer">
        <div className=" cursor-pointer transition duration-200 ease-in-out transform hover:scale-125 hover:text-black mt-2 text-gray-600 px-2">
          <BotMessageSquare />
        </div>
      </div>
    </div>
  </div>
}