import { useEffect, useState } from "react"
import { Button } from "../../components/Button"
import { Heading } from "../../components/Heading"
import { InputBox } from "../../components/InputBox"
import axios from "axios"
import { useRecoilState } from "recoil"
import { wordss, typereffectt, currentindex, actions } from '../atom'; 
import { pdfjs } from 'react-pdf';
import { PdfComp } from "../../components/PdfComp"
import { BACKEND_URL } from "../config"

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.js',
  import.meta.url,
).toString();

export function View() {
  const [words, setWords] = useRecoilState(wordss);
  const [typereffect, setTyperEffect] = useRecoilState(typereffectt)
  const [currentIndex, setCurrentIndex] = useRecoilState(currentindex)
  const [input, setInput] = useState('')
  const [popup, setPop] = useState('')
  const [isOpen, setIsopen] = useState(false) 
  const [chatHistory, setChatHistory] = useState<{ message: string; sender: string }[]>([]);
  const [viewPdf,setViewpdf] = useState(true)   
  const[filename,setFilename] = useState('')
  const [content, setContent] = useState('')
  const [action,setActions] = useRecoilState(actions)

  console.log(chatHistory,setFilename);
  
  useEffect(() => {
    if (words.length == 0) {
      setTyperEffect(' ')
      return;
    }
    // let currentIndex = 0
    const interval = setInterval(() => {
      if (currentIndex < words.length) {
        const nextword = words[currentIndex];
        setTyperEffect((prev) => prev + "" + nextword)
        setCurrentIndex((prev) => prev + 1)
      } else {
        clearInterval(interval)
      }
    }, 50);
    return () => clearInterval(interval)
  }, [words, currentIndex])

  const fetchResponse = async () => {
    if (input=='') {
      setTimeout(() => {
        setIsopen(false)
        setPop('')
      }, 2000);
      setIsopen(true),
      setPop('Please type something first')
    }
    else{
      const userMessage = input;
  setChatHistory(prevChatHistory => [...prevChatHistory, { message: userMessage, sender: 'user' }]);
      setIsopen(true)
      setPop('Generating response..')
      const res = await axios.post('http://127.0.0.1:5000/chat', { message: input })
      const message = res.data.response
      //  setTimeout(() => {
      //    setIsopen(false)
      //    setPop('')
      //   }, 2000);
      
      console.log(message);
      setWords(message)
      setTyperEffect('') 
      setCurrentIndex(0)
      setIsopen(false)
      setViewpdf(false)
      setInput('')
      setPop('')
    }

  }

  useEffect(()=>{
    const viewdoc = async()=>{
      const res = await axios.post(
        `${BACKEND_URL}/api/v3/doctors/pdf`,
        {
          filename:localStorage.getItem('analyze'),
          username:localStorage.getItem('userName'),
          actions:action
          
      },
        {
          responseType:'blob',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('docToken')
          }
        }
      );
      const blog = URL.createObjectURL(res.data); 
       setContent(blog)
    }
    viewdoc()
  },[filename])

  

  return <div className="text-slate-600">
    <div className="flex justify-center">
      <div className={`popup ${isOpen ? 'active' : 'hide'} ${popup.includes('feilds') || popup.includes('Please') || popup.includes('Invalid') || popup.includes('email') || popup.includes('down') ? 'bg-red-300 p-2 h-11' : ''}  text-center w-80 shadow-lg bg-green-500 rounded-lg -ml-4 font-medium text-lg fixed top-4 h-11 p-1`}>{popup}</div>
    </div>
    <Heading text="This is view page"></Heading>
    <div id="pdf-content" className="flex justify-center rounded-lg shadow-lg bg-slate-200 border w-full mt-8 text-white">
       {viewPdf?(
          <div>
           <PdfComp content={content} />
          <p> 
          </p>
        </div>
       ):( 
      <div className="flex shadow-xl rounded-lg bg-slate-400 p-2 w-full mx-7 mt-8 h-12">
      <h3 className="flex font-semibold text-lg text-zinc-800">
        {typereffect}
      </h3>
      </div>  
       )}
    </div>
    
    <div id="inputss" className="flex justify-center mt-9 px-11">
    
      <div className=" ml-7 w-full ">
        <InputBox placeholder={'Ask you query...'} label={''} onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
          fetchResponse();
        }
      }} onChange={(e: any) => { setInput(e.target.value) }} value={input} />
      
      </div>
      <div className="w-24 ml-2">
        <Button height={12} onclick={fetchResponse} loader={''} label={'Send'}></Button>
      </div>
    </div>


  </div>
} 