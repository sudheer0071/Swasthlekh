import { useCallback, useState } from "react"; 
import axios from "axios";
import { useDropzone } from 'react-dropzone'; 
import { BACKEND_URL } from "../pages/config"
// import { useNavigate } from "react-router-dom"; 
import logo from "../assets/tick-green-icon.svg";
import { UploadIcon } from "lucide-react";


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
      <div className=" fixed z-50 -mt-36">
       <div className={`popup ${isOpen ? 'active' : 'hide'} ${popup.includes('exist')?'bg-red-400 p-2 h-16': ' bg-orange-200 text-black'} flex justify-center text-center w-80 shadow-lg rounded-lg font-medium ml-14 text-lg  top-3 sm:p-2 md:p-2 lg:p-2`}>{popup}{popup.includes('successfully')?<img className=" ml-3 p-1 w-9 h-10 rounded-full  bg-white" src={logo} />:''}</div>
     </div>
      </div>
      
      <div>
    <div {...getRootProps()} className="flex justify-center sm:h-32 md:h-32 lg:h-32 navbar shadow-md shadow-gray-500 p-0 py-1 sm:p-3 md:p-3 lg:p-3 rounded-lg w">
      <input {...getInputProps()} /> 

      <div className="w-12 mt-4 sm:mt-7 md:mt-7 lg:mt-7">
       <UploadIcon size={33}/>
      </div>
      <p className="flex justify-center mt-3 sm:mt-6 md:mt-6 lg:mt-6 ml-2 font-medium  sm:text-base md:text-lg lg:text-lg">Drag and drop PDF files here, <br />or click to select files</p> 
      </div>
    </div> 
    </div>
  );
}