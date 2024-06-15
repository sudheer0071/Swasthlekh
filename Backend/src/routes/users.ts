import express, { Express, Request, Response, Router, response } from 'express';
import { signinSchema, signUpSchema } from '../zodAuth';
import { PrismaClient } from '@prisma/client';
import { userAuth } from '../middleware'; 
import fs  from 'fs'
import multer from 'multer'  
import { NextApiRequest } from 'next';
import { Readable } from 'stream';
import path from 'path';
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

if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
  console.error('Environment variable GOOGLE_APPLICATION_CREDENTIALS is not set.');
  process.exit(1);
}

const storageClient = new Storage()
const bucketname = 'swasthlekh__bucket'

// IPSF STORAGE SETUP  
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');

const accessKeyId = 'BA3A2A8B05E04A48F27C'
const secretAccessKey = 'zSwGJbnd5yQ3934ZFsVqMTMbgESe7MiUddxet9To';
const IPFS_bucketName = 'swasthlekh'; 

const jwt = require('jsonwebtoken')
const route: Router = express.Router()
const prisma = new PrismaClient()

 

const secret = '1234hjkl'
route.get('/ts', (req: Request, res: Response) => {
  res.send('yoo backend is running in users.ts')
})

// it should work 
//  interface reqRes {
//   req:Request,
//   res:Response
// }


route.post('/signup', async (req, res) => {
  try {

    const { username, password, firstname, lastname } = req.body
    const zodVerfify = signUpSchema.safeParse(req.body)

    const alreadyExist = await prisma.user.findUnique({
      where: { username }
    })

    if (!zodVerfify.success) {
      console.log(zodVerfify);
      return res.json({ message: "make sure to add correct email" })
    }

    if (alreadyExist) {
      return res.json({ message: "username already exist , try something unique" })
    }

    const user = await prisma.user.create({
      data: { username, password, firstname, lastname }
    })

    const token = jwt.sign({ userId: user.id }, secret)

    res.json({ message: "User created successfully", token: token, username, firstname, lastname })
  } catch (error) {
    return res.json({ message: "Backend Route Error" })
  }
})

route.post('/signin', async (req: Request, res: Response) => {
  try {
    const { username, firstname, lastname, password } = req.body
    const zodVerfify = signinSchema.safeParse(req.body)
     console.log(req.body);
     
    const exist = await prisma.user.findUnique({
      where: { username }
    })
    const user = await prisma.user.findUnique({
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
      const createUser = await prisma.user.create({
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
    res.json({ message: "Fetching details...", token: token, username, firstname:user.firstname, lastname:user.lastname})

  } catch (error) {
    console.log(error);
    
    return res.json({ message: "Something went wrong", Error: error })
  }
})

route.put('/', userAuth, async (req: Request, res) => {
  const { firstname, lastname } = req.body
  const update = req.userId

  await prisma.user.update({
    where: { id: req.userId },
    data: { firstname, lastname }
  })
  res.json({ message: "Details updated sucessfully!" })
})
 
// initializing multer
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

type blobs = {
  blobname: string, data: Buffer, bucketname: string
} 
// initializind cloud storage
async function uploadToBucket({ blobname, data, bucketname }: blobs) {
  try {
    console.log("upload to bucket...");
    
    const bucket = storageClient.bucket(bucketname)
    const blob = bucket.file(blobname)
    await blob.save(data, { contentType: 'application/pdf' })
    return true
  }
  catch (e) {
    console.log("ERROR HAPPENED"); 
    console.error(e);
    return false
  }
}

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
      data += annotation.text;
    }
  }); 
  await Promise.all(promises); 
  return data; 
}

route.post('/upload', userAuth, upload.single('file'), async (req: any, res: Response) => {
  // pdfs will be uploaded to this route
  try {
    if (!req.file) {
      console.log("no file");

      return res.json({ message: "File is not uploaded" })
    }
    const { originalname, buffer } = req.file
    console.log(req.file);

    console.log("filename: " + originalname);
    const already = await prisma.file.findUnique({
      where: { filename: originalname }
    })
    if (already) {
      return res.json({ message: "File already exist" })
    }

    else { 
      console.log("creating... ");

      const resposne = await prisma.file.create({
        data: {
          filename: originalname,
          userId: req.userId,
          mimettype: req.file.mimetype,
          encoding: req.file.encoding,
          data: buffer,
          date: new Date(),
          time: new Date()
        }
      })

      const user = await prisma.user.findUnique({ where: { id: req.userId } })
      console.log("date: " + resposne.date.getDate());
      console.log("time: " + resposne.date);

      console.log("Envirment name: "+process.env.GOOGLE_APPLICATION_CREDENTIALS);
      

      if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
        console.error('Environment variable GOOGLE_APPLICATION_CREDENTIALS is not set.');
        process.exit(1);
      }
      

      const bucketName = bucketname; // Your bucket name
      const folderName = user?.username; // Folder name (username in this case)
      const filePath = `files/${folderName}/${resposne.filename}`; // Path to the file within the folder
      await uploadToBucket({blobname:filePath,data:resposne.data,bucketname:bucketName})
      // const bucket = storageClient.bucket(bucketName);
      // const blob = bucket.file(filePath);
      // await blob.save(resposne.data, { contentType: 'application/pdf' });


      // uploading file to bucket in IPFS storage
      const key = `${resposne.filename}`; //FILENAME

const s3Client = new S3Client({
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
  endpoint: 'https://s3.filebase.com', 
  region: 'us-east-1', 
});


const fileContent = resposne.data;
console.log(fileContent);

const putObjectCommand = new PutObjectCommand({
  Bucket: IPFS_bucketName,
  Key: key, 
  Body: fileContent,
  ContentType: 'application/pdf',
  ACL: 'public-read',
});


(async () => {
  try {
    await s3Client.send(putObjectCommand);
    console.log('File uploaded successfully to IPFS storage!');
  } catch (error) {
    console.error('Error uploading file:', error);
  }
})(); 

// // The ID of your GCS bucket 
const uploaded_file = `${user.username}/${resposne.filename}`
const  source_file = `gs://${bucketName}/files/${uploaded_file}`;
const extracted_json = `gs://${bucketName}/responses/${uploaded_file}/`;

process.env.GOOGLE_APPLICATION_CREDENTIALS = "emerald-griffin-424814-k5-dfa516938e65.json";
// // // Rest of your code

const client = new vision.ImageAnnotatorClient();

const gcsSourceUri = source_file;
const gcsDestinationUri = extracted_json;
 
const inputConfig = {
  mimeType: 'application/pdf',
  gcsSource: {
    uri: gcsSourceUri,
  },
};
const outputConfig = {
  gcsDestination: {
    uri: gcsDestinationUri,
  },
};
const features = [{type: 'DOCUMENT_TEXT_DETECTION' as const}]; 
const request = {
  requests: [
    {
      inputConfig: inputConfig,
      features: features,
      outputConfig: outputConfig,
    },
  ],
}; 

const [operation] = await client.asyncBatchAnnotateFiles(request);
const [filesResponse] = await operation.promise();
// const destinationUri = filesResponse.responses[0].outputConfig.gcsDestination.uri;
// console.log('Json saved to: ' + destinationUri);


//////////////////////////////////////
// GETTING BACK THE EXTARCTED DATA///
////////////////////////////////////  
return res.json({ message: "Report is uploaded successfully! ", data: { filename: resposne.filename, data: resposne.data }})
 console.log("userfile: "+resposne.filename);
console.log("username: "+user.username);
  }
  } catch (error) {
     res.json({ message: "Error in uploading", Error: error })
    console.log("user id: " + req.userId);
    console.log(error);
  }
})

route.post('/reports', userAuth, async (req: Request, res) => {
  try {

    const response = await prisma.user.findUnique({
      where: { id: req.userId },
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
      return res.json({ message: 'You have no files' })
    }

    if (response.files.length == 0) {
      console.log("no reports");
      
      return res.json({ message: "You have no reports" })
    }
  
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
   
    const files = response.files.map((file) => ({
      filename: file.filename,
      date: new Date(file.date).toLocaleString('en-US', dateOptions),// Assuming file.date is a Date object
    }));
    console.log(files);


    res.json({ message: "showing reports", files: files });
  } catch (error) {
    res.json({ message: "No resports associated with username: " })
  }
})

route.post('/pdf', userAuth, async (req: any, res: Response) => {
  const { filename } = req.body;
  console.log(req.userId);

  const user = await prisma.user.findUnique({
    where: { id: req.userId },
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
});

route.get('/logs', userAuth, async (req: Request, res:Response) => {
  const user = await prisma.user.findUnique({ where: { id: req.userId }  
  })
  const logs = await prisma.user.findUnique({
    where: {
      username: user.username 
    },
    include: {
      logs: {
        include: {
          accessedFiles: true
        }
      }  
    }
  }); 
   
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

  const all_logs = logs.logs.map((log)=>({
    doctor:log.doctorEmail,
    accessedFiles:log.accessedFiles.map((file)=>({
      actions:file.actions,
      date: new Date(file.date).toLocaleString('en-US', dateOptions),
      filename:file.filename
    }))
  }))

  console.log("showing logs.."+all_logs);
  
  res.json({ message:"laoding logs... ", logs:all_logs}) 
   
})
  
// logs should be looks like this
// logs:[
//   doctor: 'charan@gmail.com',
//   accessdFiles:{
//     {
//       date:'23 Mar 2024',
//       filename: 'abc.txt'
//     },
//     {
//       date:'23 Mar 2024',
//       filename: 'abc.txt'
//     }
//   }
// ] 
  
route.post('/chat',userAuth,async (req:Request,res:Response)=>{
  try {
    

    const {userFile,input} = req.body
  
    const user = await prisma.user.findUnique({
      where:{
        id:req.userId
      }
    })  
   const prefix = `responses/${user.username}/${userFile}/`
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
  
  

const doc = new Document({
  pageContent: data});

const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 200,
  chunkOverlap: 20,
});

const splitDocs = await splitter.splitDocuments([doc]);

const embeddings = new OpenAIEmbeddings();

const vectorStore = await MemoryVectorStore.fromDocuments(
  splitDocs,
  embeddings
);

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
// Tools
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


  chat_history.push(new HumanMessage(response.input));
  chat_history.push(new AIMessage(response.output));
   res.json({message:response.output})
  } catch (error) {
    console.log(error);
    
    res.json({message:'Right now we are facing technical problems in our ML Model, it will be fix as soon as possible until then please standby and explore the other features of swasthlekh.\n Thankyou'})
  } 
// export {prefix} 
})  

route.get('/access',userAuth ,async (req:Request,res:Response)=>{ 
  
  const user = await prisma.user.findUnique({
   where:{id:req.userId}
  })
console.log("username: "+user.username);
 
  const access = await prisma.accessReport.findMany({
   where:{
     user:user.username, grant:false
   },
   select:{
    doctor:true,
    date:true
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

const accessed = access.map((acces)=>({
  doctor:acces.doctor,
  date: new Date(acces.date).toLocaleString('en-US', dateOptions),
}))
 
 console.log("accessed: "+accessed.length);
 
res.json({message:"creating access",access:accessed})
})

route.post('/access',userAuth, async (req:Request, res:Response)=>{
   console.log("inside access");
   
  const user = await prisma.user.findUnique({
    where:{id:req.userId}
   })
  const grant = await prisma.accessReport.update({
     where:{ combinedAccess:{
      user:user.username,
      doctor:req.body.doctor
     }
    },
     data:{
      grant:true
     }
  })
console.log(grant.grant);
const createAcess = await prisma.allowedAcess.create({
  data:{
    user:user.username,
    doctor:req.body.doctor
  }
})
 res.json({message:"Access granted", grant:grant.grant})
}) 
 
export { route, secret }   