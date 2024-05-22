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

process.env['GOOGLE_APPLICATION_CREDENTIALS'] = './winter-flare-414016-a7dd7ec7508f.json';

const storageClient = new Storage()
const bucketname = 'swasthlekh_bucket'


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

  res.json({ message: "User created successfully", token: token })
})

route1.post('/signin', async (req: Request, res: Response) => {
  const { username, password } = req.body
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
    return res.json({ message: "User doesn't exist" })
  }

  if (!user) {
    return res.json({ message: "Invalid Credentials" })
  }

  console.log(exist);

  const token = jwt.sign({ userId: user.id }, secret)
  res.json({ message: "Fetching details...", token: token, firstname:user.firstname,lastname:user.lastname })
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
try {
  const alreadyExist = await prisma.accessReport.findUnique({
    where:{
     combinedAccess:{
      doctor:doc.username,
      user:username
     }
    } 
  })
  if (alreadyExist) {
    return res.json({message:'Request already sent'})
  }
  const access = await prisma.accessReport.create({
   data:{
     user:username,
     doctor:doc.username,
     date: new Date()
   }
  })
res.json({message:"creating access",access:access})
} catch (error) {
  console.log("error happened: "+ error);
  
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
  const [files] = await storage.bucket('swasthlekh_bucket').getFiles(options);
  console.log("Files: "+files)  
  const promises = files.map(async (file) => {
    // Downloads the file into a buffer in memory.
    const contents = await storage.bucket('swasthlekh_bucket').file(`${file.name}`).download();
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
    Remember: Swasthlekh do not diagnose diseases, but can refer to the reports to help user understand their reports better in easy to understand language, in way that user from non-medical background can understand .  For urgent or critical care, please seek immediate medical attention.
    IMPORTANT:
    
    Swasthlekh acknowledges greetings and thanks the user for their information,
    Swasthlekh avoids making diagnoses or suggesting specific medications,
    Swasthlekh gently redirects irrelevant questions back to the user's health concerns.
    
   Refer the following "Example Chat" - Dont directly use this in converstion,
    
    User: Hi Swasthlekh! My name is raju, I just uploaded my recent report. Can you take a look and help me understand it?
  
    Swasthlekh: Sure raju, let's take a look.  According to the report, your LDL cholesterol, the "bad" cholesterol, is elevated. This can increase your risk of heart disease over time.  The report also shows an increased white blood cell count, which could indicate an infection or inflammation.  However, to understand the white blood cell finding better, I would need some additional context.
  
    User: Interesting.  Actually, I've been feeling a bit under the weather lately, with a sore throat and a cough.  Could that be related?
  
    Swasthlekh: It's possible! An elevated white blood cell count is a common sign of the body fighting off an infection, and your symptoms seem to align with that possibility.
  
    User:  Okay, that's good to know.  Is there anything else I should be aware of in the report?
  
    Swasthlekh: Sure!  Based on the report, your blood sugar levels appear to be within the normal range, which is positive news.  However, given your elevated cholesterol and recent symptoms,  I would recommend discussing these findings with your doctor. They can provide a more personalized interpretation based on your full medical history and suggest the best course of action.
  
    User: This is so helpful, Swasthlekh!  Having you explain things is much easier to understand than the medical jargon.  I will definitely schedule an appointment with my doctor.
  
    Swasthlekh: You're welcome raju! I'm glad I could be of assistance. Remember, Swasthlekh is always here to help you understand your health reports, but for any medical concerns, consulting your doctor is the best course of action.
    
    user: That's great, thanks!  Also, what's my favorite color?
    
    Swasthlekh: While I can't answer questions unrelated to your health, I'm happy to focus on helping you feel better.  Would you like to know more about treating colds or perhaps explore some home remedies?
    
    User: Oh, right!  Treating colds would be helpful.
    
    Swasthlekh: Perfect!  Let's explore some options...  (Continues with relevant information)
    
  
  `,
  new MessagesPlaceholder("chat_history"),
   ("{input}"),
  new MessagesPlaceholder("agent_scratchpad"),
]);

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
    
    res.json({message:'Bot is down'})
  }
// export {prefix} 
})  
  

export { route1 }