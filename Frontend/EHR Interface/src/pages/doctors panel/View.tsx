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
  // const [chatHistory, setChatHistory] = useState<{ message: string; sender: string }[]>([]);
  const [viewPdf,setViewpdf] = useState(true)   
  const[filename,setFilename] = useState('')
  const [content, setContent] = useState('')
  const [action,setActions] = useRecoilState(actions) 

  const [messages, setMessages] = useState<{ text: string; sender: string; }[]>([]);
  const [latestBotMessageIndex, setLatestBotMessageIndex] = useState(-1);
console.log(setActions);

  console.log(setFilename);
  console.log(setLatestBotMessageIndex)
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
      // const userMessage = input;
  // setChatHistory(prevChatHistory => [...prevChatHistory, { message: userMessage, sender: 'user' }]);
      setIsopen(true)
      setPop('Generating response..')
      const res = await axios.post(`${BACKEND_URL}/api/v3/doctors/chat`, { username:localStorage.getItem('userName'), userFile:localStorage.getItem('analyze'), input },
      {
        headers: { 
          'Authorization': 'Bearer ' + localStorage.getItem('docToken')
        }
      } 
      )  
      const message = res.data.message
      //  setTimeout(() => {
      //    setIsopen(false)
      //    setPop('')
      //   }, 2000);
      setMessages([...messages, { text: input, sender: 'user' }, { text:message, sender: 'bot' }]);
      console.log(message);
      // setLatestBotMessageIndex(messages.length)
      // console.log("latest bot message index: "+latestBotMessageIndex); 
      
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
    <div className="flex justify-center">
    <Heading text="Analyze Reports"></Heading>
    </div>
    <div id="pdf-content" className="flex justify-center rounded-lg shadow-lg bg-slate-200 border w-full  text-white">
       {viewPdf?(
          <div>
           <PdfComp content={content} />
          <p> 
          </p>
        </div>
       ):(
        <div className=" ">
            <div id="messages" className="items-center mt-4 text-start text-xl font-medium">
            {messages.map((message, index) => (
      <div key={index} className={`message ${message.sender === 'user' ? 'shadow-sm shadow-slate-500 rounded-lg bg-slate-300 p-2 ml-auto  text-slate-500 mx-4 mt-3' : 'shadow-md shadow-slate-500 rounded-lg bg-slate-200 p-2 ml-auto text-slate-500 mx-4 mt-3'}`}>
            {message.sender==='bot'&& index === latestBotMessageIndex ? (
          <span className="bot-message">
            {/* {typereffect} */}
            <TyperEffect text={words}/>
            </span>
        ) : ( 
          message.text.split('\n').map((line, index) => (
            <p key={index}>
              {line.split(' ').map((word, wordIndex) => {
                const urlRegex = /((?:\[|\()*)(https?:\/\/\S+)((?:\]|\))*)/i;
                const match = word.match(urlRegex);
                if (match) {
                  return (
                    <span key={`${index}-${wordIndex}`}>
                      {match[1]}
                      <a href={match[2]} target="_blank" rel="noopener noreferrer">
                        {match[2]}
                      </a>
                      {match[3]}{' '}
                    </span>
                  );
                } else {
                  return <span key={`${index}-${wordIndex}`}>{word} </span>;
                }
              })}
            </p>
          ))
        )}
      </div>
    ))}
  </div>
          {/* <h3 className="flex font-semibold text-left text-lg text-zinc-800">
            <TyperEffect text={words}/>
          </h3> */}
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

function TyperEffect({text}:any){
   

  useEffect(() => {
    if (text.length == 0) {
      setTyperEffect(' ')
      return;
    }
    // let currentIndex = 0
    const interval = setInterval(() => {
      if (currentIndex < text.length) {
        const nextword = text[currentIndex];
        setTyperEffect((prev) => prev + "" + nextword)
        setCurrentIndex((prev) => prev + 1)
      } else {
        clearInterval(interval)
      }
    }, 30);
    return () => clearInterval(interval)
  }, [words, currentIndex])


    return <div className="flex border bg-slate-200 shadow-md">
      <h3 className="flex font-semibold text-lg text-zinc-800">
              {typereffect}
            </h3>
    </div>
 }

} 


