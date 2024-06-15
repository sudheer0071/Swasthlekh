import express, { Express, Request, Response, Router } from 'express';
import { signinSchema, signUpSchema } from '../zodAuth';
import { PrismaClient } from '@prisma/client';
import { userAuth } from '../middleware';
import fs from 'fs'
import path from 'path';
import { Readable } from 'stream'; 

import { ChatOpenAI } from "@langchain/openai";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { ChatPromptTemplate } from "@langchain/core/prompts";

import { createOpenAIFunctionsAgent, AgentExecutor } from "langchain/agents";
import {TavilySearchResults} from "@langchain/community/tools/tavily_search";
import { createRetrieverTool } from "langchain/tools/retriever";

 
import { RecursiveCharacterTextSplitter, TextSplitter } from "langchain/text_splitter"; 
import { OpenAIEmbeddings } from "@langchain/openai";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { createRetrievalChain } from "langchain/chains/retrieval";


import { createHistoryAwareRetriever } from "langchain/chains/history_aware_retriever";


import { MessagesPlaceholder } from "@langchain/core/prompts";
import { HumanMessage, AIMessage } from "@langchain/core/messages";
import { Document } from "@langchain/core/documents"; 
// Import environment variables
import * as dotenv from "dotenv";
dotenv.config();
// cloud vision setup
import * as os from 'os';
import { Storage } from '@google-cloud/storage';
import * as vision from '@google-cloud/vision';  

process.env.GOOGLE_APPLICATION_CREDENTIALS

const storageClient = new Storage()
const bucketname = 'swasthlekh__bucket'


const jwt = require('jsonwebtoken')
const route1: Router = express.Router()
const prisma = new PrismaClient()


const secret = '1234hjkl'
route1.get('/doc', (req: Request, res: Response) => {
  res.send('yoo backend is running in doctor.ts')
})

route1.post('/signup', async (req, res) => {
  const { username, password, firstname, lastname } = req.body
  const zodVerfify = signUpSchema.safeParse(req.body)

  const alreadyExist = await prisma.doctor.findUnique({
    where: { username }
  })
 
  if (!zodVerfify.success) {
    console.log(zodVerfify);
    return res.json({ message: "make sure to add correct email" })
  }

  if (alreadyExist) {
    return res.json({ message: "username already exist , try something unique" })
  }

  const user = await prisma.doctor.create({
    data: { username, password, firstname, lastname }
  })

  const token = jwt.sign({ userId: user.id }, secret)

  res.json({ message: "User created successfully", token: token, username, firstname, lastname })
})

route1.post('/signin', async (req: Request, res: Response) => {
  const { username,firstname, lastname, password } = req.body
  const zodVerfify = signinSchema.safeParse(req.body)

  const exist = await prisma.doctor.findUnique({
    where: { username }
  })
  const user = await prisma.doctor.findUnique({
    where: { username, password }
  })

  if (!zodVerfify.success) {
    console.log(zodVerfify);
    return res.json({ message: "make sure to add correct email" })
  }

  if (!exist) {
    if (!firstname&&!lastname) {
      return res.json({ message: "User doesn't exist" })
    }
    const createUser = await prisma.doctor.create({
      data:{ 
        username, firstname, lastname, password
      }
    })
    const token = jwt.sign({ userId: createUser.id }, secret)
    return res.json({message:"Creating account...", token: token, username, firstname:createUser.firstname, lastname:createUser.lastname})
  }


  if (!user) {
    return res.json({ message: "Invalid Credentials" })
  }

  console.log(exist);

  const token = jwt.sign({ userId: user.id }, secret)
  res.json({ message: "Fetching details...", token: token,username, firstname:user.firstname,lastname:user.lastname })
})

route1.post('/reports', userAuth, async (req: Request, res) => {
  try {

    const { username } = req.body
    console.log("patients id: " + username);

    const response = await prisma.user.findUnique({
      where: { username },
      include: {
        files: {
          select: {
            filename: true,
            data: true,
            date: true
          }
        }
      }
    })
    if (response == null) {
      return res.json({ message: 'user with username: "' + username + '" does not exist' })
    }

    if (response.files.length == 0) {
      return res.json({ message: "No resports associated with username: " + username })
    } 
    console.log(response);
    const files = response.files.map((file) => ({
      filename: file.filename,
      date: new Date(file.date).toString()// Assuming file.date is a Date object
    }));
    res.json({ message: "showing reports", files: files });
  } catch (error) {
    res.json({ message: "No resports associated with username: " + req.body })
  }
}) 
 
route1.post('/pdf', userAuth, async (req: Request, res: Response) => {
  const { filename, username,actions } = req.body;
  console.log("userid: " + req.userId);
  console.log("username: "+username);
  
 
  const user = await prisma.user.findUnique({
    where: { username },
    include: {
      files: {
        select: {
          filename: true,
          data: true
        }
      }
    } 
  }); 
 
  if (!user) {
    return res.json({ message: "User not found" }); 
  }

  const downloadPath = 'src\\downloads';

  if (!fs.existsSync(downloadPath)) {
    fs.mkdirSync(downloadPath, { recursive: true });
  }


  const file = user.files.find((file) => file.filename === filename);

  if (!file) {
    return res.json({ message: "File doesn't exist in database" });
  } else {

    const filePath = path.join(downloadPath, filename);
    fs.writeFileSync(filePath, Buffer.from(file.data));

    // Read the file from disk
    const stream = fs.createReadStream(filePath);
    const stat = fs.statSync(filePath);
    res.setHeader('Content-Length', stat.size);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="${filename}"`);

    const readableStream = new Readable({
      read() { }
    });

    // Pipe the file contents to the response
    stream.on('data', (chunk) => {
      readableStream.push(chunk);
    });
    stream.on('end', () => {
      readableStream.push(null);
    });

    readableStream.pipe(res);
  }

  console.log("file viewd ...");
  console.log("giving file...");

 const doc = await prisma.doctor.findUnique({
  where:{id:req.userId}
 })
  
 console.log("docName: "+doc.username);
 

const alreadyExist = await prisma.logs.findUnique({
  where:{
   combinedLogs:{
    doctorEmail:doc.username,
    userEmail:username
   }
  } 
})
 

console.log("already Created: "+alreadyExist);

 if (alreadyExist) {
   const logs = await prisma.logs.upsert({
     create:{
       userEmail:username,
       date: new Date(),
       doctorEmail:req.userId,
       accessedFiles:{
         create:{
           actions,
           date:new Date(),
           filename
         },
       },
     },
     update:{
       accessedFiles:{
         create:{
           actions,
           date:new Date(),
           filename
         },
       },
     },
     where: {
        combinedLogs:{
          userEmail:username,
          doctorEmail:doc.username
        }
      }
   });
 }
 else{
  try { 
    const newLog = await prisma.logs.create({
      data: {
        userEmail: username,
        doctorEmail: doc.username,
        date: new Date(),
        accessedFiles: {
          create: {
            actions:actions,
            date: new Date(),
            filename
          },
        },
      },
    }); 
    console.log("new log: "+newLog);
  } catch (error) {
    console.log(error);
    
  }
  
 }

  // console.log("createing log... "+ logs);
  
});

route1.post('/access',userAuth ,async (req:Request,res:Response)=>{
   const {username} = req.body
    
   const doc = await prisma.doctor.findUnique({
    where:{id:req.userId}
   })
  //  const userExist()
try {
  const alreadyExist = await prisma.accessReport.findUnique({
    where:{
     combinedAccess:{
      doctor:doc.username,
      user:username
     }, 
     grant:false
    }
  })
 
  console.log("alreadyExist: ");
  console.log(alreadyExist); 

  if(!alreadyExist ){  
      console.log("creating request"); 
      const access = await prisma.accessReport.create({
       data:{
         user:username,
         doctor:doc.username,
         date: new Date(),
         grant:false
       }
      })
      return res.json({message:"creating access",access:access}) 
  }
  else if(!alreadyExist.grant) { 
    
    console.log("alreadyy requestedd");
    
    return res.json({message:'Already requested'})
  } 
  
} catch (error) {
  console.log("error happened: "+ error); 
}
})
route1.post('/checkGrant',userAuth, async(req:Request,res:Response)=>{
  const {username} = req.body
    
  const doc = await prisma.doctor.findUnique({
   where:{id:req.userId}
  })

  const granted = await prisma.accessReport.findUnique({
    where:{
     combinedAccess:{
      doctor:doc.username,
      user:username
     }, 
     grant:true
    }
  })
  if (granted) {
    return res.json({message:'request granted'}) 
  }

})
route1.post('/allow',userAuth,async(req:Request, res:Response)=>{
  const {username} = req.body
   console.log('inside allow');
   
   const doc = await prisma.doctor.findUnique({
    where:{id:req.userId}
   })

   const allow = await prisma.allowedAcess.findFirst({
    where:{
      user:username,
      doctor:doc.username
    }
   })

   if (allow) {
    return res.json({message:'allowed',allow})
   }
   res.json({message:"Doesn't allowed yet"})

})
async function listFilesByPrefix(prefix:any) {
  const storage = new Storage();
  var data = ''
  console.log("inside listFliesbyPrefix: ")  
  
  const delimiter = '/'; 
  const options:any = {
    prefix: prefix,
  }; 
console.log("prefix: "+prefix);

  if (delimiter) {
    options.delimiter = delimiter;
  } 
  
  // Lists files in the bucket, filtered by a prefix
  const [files] = await storage.bucket('swasthlekh__bucket').getFiles(options);
  console.log("Files: "+files)  
  const promises = files.map(async (file) => {
    // Downloads the file into a buffer in memory.
    const contents = await storage.bucket('swasthlekh__bucket').file(`${file.name}`).download();
    const jstring = JSON.parse(contents.toString())
    const pgnumber = jstring.responses.length;

    for (let i = 0; i < pgnumber; i++) {
      const PageResponse = jstring.responses[i];
      const annotation = PageResponse.fullTextAnnotation;   
      // console.log("annotations: "+annotation.text); 
      data += annotation.text;
    }
  }); 
  await Promise.all(promises); 
  return data;
}

route1.post('/chat',userAuth,async (req:Request,res:Response)=>{
  try{
  const {username,userFile,input} = req.body

  // const user = await prisma.user.findUnique({
  //   where:{
  //     id:req.userId
  //   }
  // })  
  
 const prefix = `responses/${username}/${userFile}/`
// The delimiter to use 
// var dataaa 
const data = await listFilesByPrefix(prefix)
// .then((data) => { 
//   dataaa = data 
//   console.log("data Insie: "+dataaa);
  
// // res.json({extracted:data}) 
// })
// .catch((error) => {
// console.error("Error: " + error);
// });
 
dotenv.config();
console.log("below dotenv: ");

// Instantiate Model
const doc = new Document({
  pageContent: data});
  
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 200,
    chunkOverlap: 20,
});
console.log("below splitter: ");

const splitDocs = await splitter.splitDocuments([doc]);

const embeddings = new OpenAIEmbeddings();

const vectorStore = await MemoryVectorStore.fromDocuments(
  splitDocs,
  embeddings
);

console.log("below vectorStore: ");
const retriever = vectorStore.asRetriever({
  k: 5,
});

// Instantiate the model
const model = new ChatOpenAI({
  modelName: "gpt-3.5-turbo-1106",
  temperature: 0.7,
});

// Prompt Template
const prompt = ChatPromptTemplate.fromMessages([`
"User", 
    You are a friendly and informative chatbot designed to assist user with analysing the reports called "Swathlekh". Swathlekh can answer user questions, offer guidance, and suggest next steps.
    Remember: Swasthlekh do not diagnose diseases, but can refer to the reports and refer to the chat history {chat_history} to help user understand their reports better in easy to understand language, in way that user from non-medical background can understand .  For urgent or critical care, please seek immediate medical attention.
    IMPORTANT:
    
    Swasthlekh acknowledges greetings and thanks the user for their information,
    Swasthlekh avoids making diagnoses or suggesting specific medications,
    Swasthlekh gently redirects irrelevant questions back to the user's health concerns.
 `,
  new MessagesPlaceholder("chat_history"),
   ("{input}"),
  new MessagesPlaceholder("agent_scratchpad"),
]);


// TEST PROMPT
// const template = `You are a friendly and informative chatbot designed to assist user with analysing the reports called 'Swathlekh'. 
// Swathlekh can answer user questions, offer guidance, and suggest next steps. Remember: Swasthlekh do not diagnose diseases, 
// but can refer to the reports to help user understand their reports better in easy to understand language, 
// in a way that user from non-medical background can understand .  
// For urgent or critical care, please seek immediate medical attention. 
// Swasthlekh acknowledges greetings and thanks the user for their information, 
// Swasthlekh avoids making diagnoses or suggesting specific medications, 
// Swasthlekh gently redirects irrelevant questions back to the users health concerns. {context} {chat_history} Human: {human_input} SwasthLekh:`

// prompt = ChatPromptTemplate.from_messages([
//     ("system", template.format(
//         context=context_placeholder,
//         chat_history=chat_history_placeholder,
//         human_input=human_input_placeholder
//     )),"agent_scratchpad",'tools','tool_names'
// ])
// Tools
console.log("below vectorStore: ");

const searchTool = new TavilySearchResults();
const retrieverTool = createRetrieverTool(retriever, {
  name: "report_search",
  description:
    "use this when user asks the first query",
});

const tools = [searchTool,retrieverTool];



const agent = await createOpenAIFunctionsAgent({
  llm: model,
  tools,
  prompt,


});


// Create the executor
const agentExecutor = new AgentExecutor({
  agent,
  tools,
});

console.log("below agentExecuter: ");

// const rl = readline.createInterface({
//   input: process.stdin,
//   output: process.stdout,
// });

const chat_history:any = [];

// function askQuestion() {
//   rl.question("User: ", async (input) => {
//     if (input.toLowerCase() === "exit") {
//       rl.close();
//       return;
//     } 

  const response = await agentExecutor.invoke({
      input: input, //userinput
      chat_history: chat_history,
    });

  // console.log("Agent: ", response.output);

  console.log("below response: ");

  chat_history.push(new HumanMessage(response.input));
  chat_history.push(new AIMessage(response.output));
  console.log("response: "+response.output);
  
   res.json({message:response.output})
  } catch (error) {
    console.log(error);
    
    res.json({message:'Right now we are facing technical problems in our ML Model, it will be fix as soon as possible until then please standby and explore the other features of swasthlekh.\n Thankyou'})
  }
// export {prefix} 
})  

route1.post('/find',userAuth, async(req:Request, res:Response)=>{
  const find = await prisma.user.findFirst({
    where:{
      username:req.body.username
    }
  })
  console.log(req.body.username);
  
  if (find) {
    console.log("found");
    return res.json({message:"Patient found! "})
  }
  console.log("not found");
  res.json({message:"Patient not found"})
})
 
route1.get('/findRequest',userAuth,async(req:Request, res:Response)=>{
  const doc = await prisma.doctor.findUnique({
    where:{id:req.userId}
   })
   console.log("inside find request");
   
   const request = await prisma.accessReport.findMany({
    where:{ 
      doctor:doc.username, 
    },select:{
      user:true,
      date:true,
      grant:true
    }
   })

   const dateOptions: Intl.DateTimeFormatOptions = {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
};
 const requests = request.map((rqst)=>({
  user:rqst.user,
  grant:rqst.grant,
  date:new Date(rqst.date).toLocaleString('en-US', dateOptions),
 }))
  console.log(request);
  
   if (request.length!=0) {
    return res.json({message:'showing requests',request:requests})
   }
   res.json({message:'no requests'}) 
})

route1.get('/viewed',userAuth,async(req:Request,res:Response)=>{
  const doc = await prisma.doctor.findUnique({
    where:{id:req.userId}
   })

   const viewed = await prisma.logs.findMany({
    where:{
      doctorEmail:doc.username 
    },
    select:{
      userEmail:true,
      date:true,
      accessedFiles:{
        select:{
          actions:true,
          date:true,
          filename:true
        }
      }
    }
   })

   const dateOptions: Intl.DateTimeFormatOptions = {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
};

  const all_logs = viewed.map((log)=>({
    user:log.userEmail,
    date: new Date(log.date).toLocaleString('en-US', dateOptions),
    accessedFiles:log.accessedFiles.map((file)=>({
      actions:file.actions,
      date: new Date(file.date).toLocaleString('en-US', dateOptions),
      filename:file.filename
    }))
  }))

   console.log(all_logs);
   res.json({viewed:all_logs})
   
})  

export { route1 }