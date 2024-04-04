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

    res.json({ message: "User created successfully", token: token })
  } catch (error) {
    return res.json({ message: "Backend Route Error" })
  }
})

route.post('/signin', async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body
    const zodVerfify = signinSchema.safeParse(req.body)

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
      return res.json({ message: "User doesn't exist" })
    }

    if (!user) {
      return res.json({ message: "Invalid Credentials" })
    }

    console.log(exist);

    const token = jwt.sign({ userId: user.id }, secret)
    res.json({ message: "Fetching details...", token: token, firstname: user.firstname })

  } catch (error) {
    return res.json({ message: "Backend is down", Error: error })
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
    console.log("inside upload...");
    
    const bucket = storageClient.bucket(bucketname)
    const blob = bucket.file(blobname)
    await blob.save(data, { contentType: 'application/pdf' })
    return true
  }
  catch (e) {
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

      const bucketName = bucketname; // Your bucket name
      const folderName = user?.username; // Folder name (username in this case)
      const filePath = `files/${folderName}/${resposne.filename}`; // Path to the file within the folder
      await uploadToBucket({blobname:filePath,data:resposne.data,bucketname:bucketName})
      // const bucket = storageClient.bucket(bucketName);
      // const blob = bucket.file(filePath);
      // await blob.save(resposne.data, { contentType: 'application/pdf' });
      res.json({ message: "Report is uploaded successfully! ", data: { filename: resposne.filename, data: resposne.data }})
      console.log("userfile: "+resposne.filename);
 console.log("username: "+user.username);
 
// // The ID of your GCS bucket 
const uploaded_file = `${user.username}/${resposne.filename}`
const  source_file = `gs://${bucketName}/files/${uploaded_file}`;
const extracted_json = `gs://${bucketName}/responses/${uploaded_file}/`;
process.env.GOOGLE_APPLICATION_CREDENTIALS = "winter-flare-414016-a7dd7ec7508f.json";
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
      return res.json({ message: "You have no reports" })
    }
  
    const files = response.files.map((file) => ({
      filename: file.filename,
      date: new Date(file.date).toString()// Assuming file.date is a Date object
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
  
  // Instantiate Model
  const model = new ChatOpenAI({
    modelName: "gpt-3.5-turbo",
    temperature: 0.9,
  }); 
  
  // Create prompt
  const prompt = ChatPromptTemplate.fromMessages(
    [`
  
    You are a friendly and informative chatbot designed to assist user with analysing the reports called "Swathlekh". Swathlekh can answer user questions, offer guidance, and suggest next steps.
    Remember: Swasthlekh do not diagnose diseases, but can refer to the context to help user understand their reports better in easy to understand language, in way that user from non-medical background can understand .  For urgent or critical care, please seek immediate medical attention.
    
    
    Example Chat:
    
    User: Hi Swasthlekh! I just uploaded my recent blood test report. Can you take a look and help me understand it?
  
    Swasthlekh: Sure, let's take a look.  According to the report, your LDL cholesterol, the "bad" cholesterol, is elevated. This can increase your risk of heart disease over time.  The report also shows an increased white blood cell count, which could indicate an infection or inflammation.  However, to understand the white blood cell finding better, I would need some additional context.
  
    User: Interesting.  Actually, I've been feeling a bit under the weather lately, with a sore throat and a cough.  Could that be related?
  
    Swasthlekh: It's possible! An elevated white blood cell count is a common sign of the body fighting off an infection, and your symptoms seem to align with that possibility.
  
    User:  Okay, that's good to know.  Is there anything else I should be aware of in the report?
  
    Swasthlekh: Sure!  Based on the report, your blood sugar levels appear to be within the normal range, which is positive news.  However, given your elevated cholesterol and recent symptoms,  I would recommend discussing these findings with your doctor. They can provide a more personalized interpretation based on your full medical history and suggest the best course of action.
  
    User: This is so helpful, Swasthlekh!  Having you explain things is much easier to understand than the medical jargon.  I will definitely schedule an appointment with my doctor.
  
    Swasthlekh: You're welcome! I'm glad I could be of assistance. Remember, Swasthlekh is always here to help you understand your health reports, but for any medical concerns, consulting your doctor is the best course of action.
    
    user: That's great, thanks!  Also, what's my favorite color?
    
    Swasthlekh: While I can't answer questions unrelated to your health, I'm happy to focus on helping you feel better.  Would you like to know more about treating colds or perhaps explore some home remedies?
    
    User: Oh, right!  Treating colds would be helpful.
    
    Swasthlekh: Perfect!  Let's explore some options...  (Continues with relevant information)
    
    Additional Notes:
    
    Swasthlekh acknowledges greetings and thanks the user for their information.
    Swasthlekh avoids making diagnoses or suggesting specific medications.
    Swasthlekh gently redirects irrelevant questions back to the user's health concerns.
  
    Context: {context}
  
    Question: {input}`]
  );
  
  const retrieverPrompt = ChatPromptTemplate.fromMessages([
    new MessagesPlaceholder("chat_history"),
    ["user", "{input}"],
    [
      "user",
      "Given the above conversation, generate a search query to look up in order to get information relevant to the conversation",
    ],
  ]);
  
   
  
  // Create Chain
  const chain = await createStuffDocumentsChain({
    llm: model,
    prompt,
  
  }); 
  
  
  // const data = localStorage.getItem("ExtractedData")
  const doc = new Document({
    pageContent: data
  })
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 20,
  });
  const splitDocs = await splitter.splitDocuments([doc]);
  const embeddings = new OpenAIEmbeddings();
  
  // Create Vector Store
  const vectorstore = await MemoryVectorStore.fromDocuments(
    splitDocs,
    embeddings,
   );
   
   // Create a retriever from vector store
   const retriever = vectorstore.asRetriever({ k: 5 });
  
   const retrieverChain = await createHistoryAwareRetriever({
    llm: model,
    retriever,
    rephrasePrompt:retrieverPrompt,
  });
  
  const chatHistory:any = [];
  
  function add_history(response:any){
    new HumanMessage(response.input),
    new AIMessage(response.answer)
  };
  
  
   // Create a retrieval chain
   const retrievalChain = await createRetrievalChain({
     combineDocsChain: chain,
     retriever,
   });
  
   const response = await retrievalChain.invoke({
    chat_history: chatHistory,
     input
   }); 
  //  console.log("AI BOLTA HAI KI: ",response)  
  add_history(response)
  console.log(response.answer);
  
   res.json({message:response.answer})
  } catch (error) {
    console.log(error);
    
    res.json({message:'Bot is down'})
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
     user:user.username, 
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


export { route, secret }   