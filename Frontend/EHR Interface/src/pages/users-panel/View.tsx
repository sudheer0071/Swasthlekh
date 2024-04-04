import { useEffect, useState } from "react"
import { Button } from "../../components/Button"
import { Heading } from "../../components/Heading"
import { InputBox } from "../../components/InputBox"
import axios from "axios"
import { useRecoilState } from "recoil"
import { wordss, typereffectt, currentindex } from '../atom'; 
import { pdfjs } from 'react-pdf';
import { PdfComp } from "../../components/PdfComp"
import { BACKEND_URL } from "../config"

import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css'
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

  const [messages, setMessages] = useState<{ text: string; sender: string; }[]>([]);
  const [latestBotMessageIndex, setLatestBotMessageIndex] = useState(-1);
//  console.log(chatHistory,setFilename);
 console.log(setLatestBotMessageIndex,setFilename);
 

  // useEffect(() => {
  //   if (words.length == 0) {
  //     setTyperEffect(' ')
  //     return;
  //   }
  //   // let currentIndex = 0
  //   const interval = setInterval(() => {
  //     if (currentIndex < words.length) {
  //       const nextword = words[currentIndex];
  //       setTyperEffect((prev) => prev + "" + nextword)
  //       setCurrentIndex((prev) => prev + 1)
  //     } else {
  //       clearInterval(interval)
  //     }
  //   }, 50);
  //   return () => clearInterval(interval)
  // }, [words, currentIndex])

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
    <div className="text-slate-600 overflow-hidden">
      <div className="flex justify-center">
        <div className={`popup ${isOpen ? 'active' : 'hide'} ${popup.includes('feilds') || popup.includes('Please') || popup.includes('Invalid') || popup.includes('email') || popup.includes('down') ? 'bg-red-400 p-2 h-11' : ''}  text-center w-80 shadow-lg bg-green-500 text-white rounded-lg -ml-4 font-medium text-lg fixed top-4 h-11 p-1`}>{popup}</div>
      </div>
      <Heading text="Analyze your Reports in single click"></Heading>
      <div id="pdf-content" className=" rounded-lg shadow-lg bg-slate-200 border w-full text-white">
        {viewPdf ? (
          <div>
            <PdfComp content={content} />
            <p>
            </p>
          </div>
        ) : (
          <div className=" ">
              <div id="messages" className="items-center mt-4 text-start text-xl font-medium">
              {messages.map((message, index) => (
        <div key={index} className={`message ${message.sender === 'user' ? 'shadow-sm shadow-slate-500 rounded-lg bg-slate-300 p-2 ml-auto  text-slate-500 mx-4 mt-3' : 'shadow-md shadow-slate-500 rounded-lg bg-slate-200 p-2 ml-auto text-slate-500 mx-4 mt-3'}`}>
              {message.sender==='bot'&& index === latestBotMessageIndex ? (
            <span className="bot-message">
              {typereffect}
              <TyperEffect text={words}/>
              </span>
          ) : ( 
                
            message.text
          )}
        </div>
      ))}
    </div>
            <h3 className="flex font-semibold text-left text-lg text-zinc-800">
              <TyperEffect text={words}/>
            </h3>
          </div>
        )}
      </div>
  
      <div id="inputss" className="flex justify-center mt-10">
        <div className=" ml-7 w-full ">
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
        <div className="w-24 ml-2">
          <Button
            height={12}
            onclick={fetchResponse}
            loader={''}
            label={'Send'}
          ></Button>
        </div>
      </div>
    </div>
    {/* <Chat></Chat> */}
    </div>
  );
  
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


// function Chat(){
//   const [typing,setTyping] = useState(false)
//  const [messages, setMessages] = useState([
//   {
//     message:'hi i am chatGPT!',
//     sender:'ChatGPT'
//   } 
//  ])

//  const handleSend = async(message:any)=>{
//    const newMessage = {
//     message:message,
//     sender:"user",
//     // direction:"Outgoing"
//    }
//    const newMessages = [...messages,newMessage]
//    setMessages(newMessages)
//    setTyping(true)
//  }

//  async function processMessages(chatMessages:any) {
//     // chatMessages { sender :"user" or "ChatGpt", message:}
//     // apiMessage { sender :"user" or "ChatGpt", message:}
//  }

//  return   <div className=" h-96">
//     <MainContainer>
//       <ChatContainer>
//         <MessageList typingIndicator={typing?<TypingIndicator content="ChatGPT is typing"/>:null}> 
//             {messages.map((message:any,i:any)=>(
//               <Message key={i} model={message}/>
//             ))}
//         </MessageList>
//         <MessageInput placeholder="Type message here" onSend={handleSend} />
//       </ChatContainer>
//     </MainContainer>
//   </div> 
// } 