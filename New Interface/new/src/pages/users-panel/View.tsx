import { useEffect, useState } from "react" 
import { Heading } from "../../components/Heading" 
import axios from "axios"
import { useRecoilState } from "recoil"
import { wordss, typereffectt, currentindex } from '../atom'; 
import { pdfjs } from 'react-pdf';
import { PdfComp } from "../../components/PdfComp"
import { BACKEND_URL } from "../config"
import { Bot, Send } from "lucide-react"
import { useChatScroll } from "../../hooks/useChatScroll"
import { useMediaQuery } from "react-responsive"

// import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css'
// import { MainContainer, ChatContainer, MessageList,Message,MessageInput,TypingIndicator} from '@chatscope/chat-ui-kit-react'

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
  
  // const[avatar, setAvatar] = useState('')
console.log(setFilename);

  const [messages, setMessages] = useState<{ text: string; sender: string; }[]>([]);
  const [latestBotMessageIndex, setLatestBotMessageIndex] = useState(-1);
  const mini = useMediaQuery({query:'(max-width:550px)'})

//  console.log(chatHistory,setFilename);
//  console.log(setLatestBotMessageIndex,setFilename);
 const ref = useChatScroll(messages)


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
    }, 10);
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
      setIsopen(true)
      setPop('Generating response..')
      console.log("inside main fetch 1");
      console.log("token: "+localStorage.getItem('chat_token'));
      
              const res = await axios.post(
                `${BACKEND_URL}/api/v3/users/chat`,
                {userFile:localStorage.getItem('analyzee'),input},
                {
                  headers: { 
                    'Authorization': 'Bearer ' + localStorage.getItem('chat_token')
                  }
                } 
              ); 
      const message = res.data.message 
      // const message = res.data.response
      //  setTimeout(() => {
      //    setIsopen(false)
      //    setPop('')
      //   }, 2000);
      setMessages([...messages, { text: input, sender: 'user' }, { text:message, sender: 'bot' }]);
      console.log(message);
      setLatestBotMessageIndex(messages.length)
      console.log("latest bot message index: "+latestBotMessageIndex); 
      
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
        `${BACKEND_URL}/api/v3/users/pdf`,
        {filename:localStorage.getItem('analyze')},
        {
          responseType:'blob',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('TOKEN')
          }
        }
      );
      const blog = URL.createObjectURL(res.data); 
       setContent(blog)
    }
    viewdoc()
  },[filename])



  return (
    <div >
    <div className="text-slate-600 overflow-hidden -mt-14 sm:-mt-14 md:-mt-20 lg:-mt-32 px-1 md:px-3 lg:px-5 ">
      <div className="flex justify-center text-black">
        <div className={`popup ${isOpen ? 'active' : 'hide'} ${popup.includes('feilds') || popup.includes('Please') || popup.includes('Invalid') || popup.includes('email') || popup.includes('down') ? 'bg-red-400 p-2 h-11' : ' bg-orange-200 text-black'}  text-center w-80 shadow-lg rounded-lg -ml-4 font-medium text-lg fixed top-4 h-11 p-1`}>{popup}</div>
      </div>
      <div className=" z-10 mt-4 sm:mt-9 md:-mt-7 lg:-mt-7">
      <Heading size={mini?1:4} text="Analyze your Reports in single click"></Heading>
      </div>
      
      {<div id="pdf-content" ref={ref} className="heigh z-20 h-5/6 scroll-smooth focus:scroll-auto rounded-lg mt md:mt-6 lg:mt-7 shadow-sm px-0  bg-slate-50" >
        {viewPdf ? (
          <div className=" bg-custom ">
          <div>
            <PdfComp content={content} />
            <p>
            </p>
          </div>
          </div>
        ) : (
          <div className="">
            <div id="messages" className="items-center scroll-smooth focus:scroll-auto px4 mt-4 text-start text-sm md:text-xl lg:text-xl font-medium ">
              
            {messages.map((message, index) => (
      <div key={index}  className={`message ${message.sender === 'user' ? ' rounded-lg p-1 md:p-2 lg:p-2 ml-auto text-black font-medium border-b-2 mx-4 mt-3' : ' rounded-lg   p-2 ml-auto text-black bg-orange-50 font-normal mx-4 mt-3 border-b-2 '}`}>
             { message.sender=='bot'&&index === latestBotMessageIndex+1 ? ( 
            <span className="bot-message flex"> 
            <div className= {`items-center text-center shadow-orange-400 navbar shadow-md rounded-full size-7 md:size-10 lg:size-10 text-xl`}> <div  className=' flex justify-center md:mt-1 lg:mt-1'></div><div className=" md:mt-1 lg:mt-1 md:m-2 lg:m-2"><Bot/></div> </div><div></div>
            <div className=" ml-3">
            {typereffect.split('\n').map((line, index)=> <p>
                {line.split('/n').map((word, wordIndex) => {
                    const mainWord = word.split(')')
                    const words = mainWord[0]
                    const urlRegex = /((?:\[|\()*)(https?:\/\/\S+)((?:\]|\))*)/i;
                    const match = words.match(urlRegex);
                  if (match) {
                    return (
                      <span className=" font-mono text-blue-700" key={`${index}-${wordIndex}`}>
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
            </p>)} 
            </div> 
              </span>
          ) : ( 
            message.text.split('\n').map((line, index) => (<div className="flex">
            {message.sender=='bot'?index==0?<div className= {`items-center text-center shadow-orange-400 navbar shadow-md rounded-full size-7 md:size-10 lg:size-10 text-xl`}> <div  className=' flex justify-center md:mt-1 lg:mt-1'></div><div className="   md:mt-1 lg:mt-1 md:m-2 lg:m-2"><Bot/></div> </div>:<div></div>:<div className= {`items-center text-center bg-slate-300 rounded-full size-7 md:size-10 lg:size-10 md:text-xl lg:text-xl`}> <div className=' flex justify-center mt-1 md:mt-1 lg:mt-1'></div>{(localStorage.getItem('fname')?.charAt(0).toUpperCase())} </div>}   
              <div className=" ml-3 mt-1 items-center">
              <p key={index}>
                {line.split(' ').map((word, wordIndex) => {
                    const mainWord = word.split(')')
                    const words = mainWord[0]
                    const urlRegex = /((?:\[|\()*)(https?:\/\/\S+)((?:\]|\))*)/i;
                    const match = words.match(urlRegex);
                  if (match) {
                    return (
                      <span className=" font-mono text-blue-700" key={`${index}-${wordIndex}`}>
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
              </div>
            </div>
            ))
          )}
      </div>
    ))}
  </div> 
        </div>
        )}
      </div> } 
        {/* <div id="in " className=" flex absolute bottom-0 justify-center lg:px-10  md:mt-4 lg:mt-4">
        <div id="idd" className=" ">
          <InputBox
            placeholder={'Ask you query...'}
            label={''}
            onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) => {
              if (e.key === 'Enter') {
                fetchResponse();
              }
            }}
            onChange={(e: any) => {
              setInput(e.target.value);
            }}
            value={input}
          />  
        </div>
        <div onClick={fetchResponse} className="  cursor-pointer transition duration-200 ease-in-out transform hover:scale-125 text-slate-500 mt-7 -ml-10">
          <Send size={29} /> 
        </div>
      </div>   */}
     
       <div className=" ">
    <div className="fixed bottom- flex justify-between shadow-amber-600">
      <input id="right" className=" text-lg shadow-md shadow-slate-800 px-2 border rounded h-12 font-medium border-slate-200 py-1 bg-white border-1 w-4/5 md:w-9/12 lg:w-9/12 fixed bottom-2  p-2 border-t"  onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
              if (e.key === 'Enter') {
                fetchResponse();
              }
            }}
            onChange={(e: any) => {
              setInput(e.target.value);
            }}
            value={input} type="text" placeholder="Ask your Query" />
    <div id="btn" onClick={fetchResponse} className=" fixed bottom-3 cursor-pointer transition duration-200 ease-in-out transform hover:scale-125 text-slate-500 ">
          <Send size={29} /> 
        </div>
    </div>
  </div>
    </div>  
    </div>
  );
   
} 
  