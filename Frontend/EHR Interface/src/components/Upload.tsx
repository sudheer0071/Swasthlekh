import { useCallback, useState } from "react"; 
import axios from "axios";
import { useDropzone } from 'react-dropzone'; 
import { BACKEND_URL } from "../pages/config"
// import { useNavigate } from "react-router-dom"; 
import logo from "../assets/tick-green-icon.svg";


export function Upload(){ 
  const [popup, setPopup] = useState("")
  const [isOpen, setIsopen] = useState(false)
   
  // const navigate = useNavigate()

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    const formData = new FormData();
    formData.append('file', file);

    try {
      console.log(localStorage.getItem("TOKEN"));
      setIsopen(true)
      setPopup('Uploading...')
      const response = await axios.post(`${BACKEND_URL}/api/v3/users/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': 'Bearer '+localStorage.getItem('TOKEN')
        }
      });
      const json = response.data.message

      if (json.includes('successfully')) {  
          setTimeout(() => {
            setIsopen(false)
            setPopup('')
            // navigate('/users/home')
            window.location.reload()
          }, 3000);
          setIsopen(true)
          setPopup(json)
      }
      else{
        setTimeout(() => {
          setIsopen(false)
          setPopup('')
        }, (2000));
        setIsopen(true)
        setPopup(json)
      }
      console.log(response.data.message);
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  }, []);
 

  const {getRootProps, getInputProps} = useDropzone({onDrop})

  return (
    <div className=""> 
     <div className="flex justify-center">
       <div className={`popup ${isOpen ? 'active' : 'hide'} ${popup.includes('exist')?'bg-red-400 p-2 h-16': ''} flex justify-center text-center w-80 shadow-lg bg-green-500 rounded-lg font-medium ml-14 text-lg fixed top-3 p-2`}>{popup}{popup.includes('successfully')?<img className=" ml-3 p-1 w-9 h-10 rounded-full  bg-white" src={logo} />:''}</div>
     </div>
      
      <div>
    <div {...getRootProps()} className="flex justify-center h-32 bg-slate-200 shadow-md shadow-gray-500 p-3 rounded-lg w">
      <input {...getInputProps()} /> 

      <div className="w-12 mt-7">
      <svg fill="#5e6e7d" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 490.955 490.955">
        <g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier">
         <path id="XMLID_448_" d="M445.767,308.42l-53.374-76.49v-20.656v-11.366V97.241c0-6.669-2.604-12.94-7.318-17.645L312.787,7.301 C308.073,2.588,301.796,0,295.149,0H77.597C54.161,0,35.103,19.066,35.103,42.494V425.68c0,23.427,19.059,42.494,42.494,42.494 h159.307h39.714c1.902,2.54,3.915,5,6.232,7.205c10.033,9.593,23.547,15.576,38.501,15.576c26.935,0-1.247,0,34.363,0 c14.936,0,28.483-5.982,38.517-15.576c11.693-11.159,17.348-25.825,17.348-40.29v-40.06c16.216-3.418,30.114-13.866,37.91-28.811 C459.151,347.704,457.731,325.554,445.767,308.42z M170.095,414.872H87.422V53.302h175.681v46.752 c0,16.655,13.547,30.209,30.209,30.209h46.76v66.377h-0.255v0.039c-17.685-0.415-35.529,7.285-46.934,23.46l-61.586,88.28 c-11.965,17.134-13.387,39.284-3.722,57.799c7.795,14.945,21.692,25.393,37.91,28.811v19.842h-10.29H170.095z M410.316,345.771 c-2.03,3.866-5.99,6.271-10.337,6.271h-0.016h-32.575v83.048c0,6.437-5.239,11.662-11.659,11.662h-0.017H321.35h-0.017 c-6.423,0-11.662-5.225-11.662-11.662v-83.048h-32.574h-0.016c-4.346,0-8.308-2.405-10.336-6.271 c-2.012-3.866-1.725-8.49,0.783-12.07l61.424-88.064c2.189-3.123,5.769-4.984,9.57-4.984h0.017c3.802,0,7.38,1.861,9.568,4.984 l61.427,88.064C412.04,337.28,412.328,341.905,410.316,345.771z">
          </path> 
          </g>
      </svg>
      </div>
      <p className="flex justify-center mt-6 ml-2 text-zinc-500 font-medium text-lg">Drag and drop PDF files here, <br />or click to select files</p> 
      </div>
    </div> 
    </div>
  );
}