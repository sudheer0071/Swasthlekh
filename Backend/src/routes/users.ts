import express,{Express, Request, Response, Router} from 'express';
import {signinSchema,signUpSchema} from '../zodAuth';
import { PrismaClient } from '@prisma/client'; 
import { userAuth } from '../middleware';
import { strict } from 'assert';  
import fs from 'fs'
import multer from 'multer'
import { NextApiRequest } from 'next';
import { Readable } from 'stream';
import path from 'path';

const jwt = require('jsonwebtoken')
const route:Router  = express.Router()
const prisma = new PrismaClient()

const secret = '1234hjkl'
route.get('/ts',(req:Request,res:Response)=>{
  res.send( 'yoo backend is running in users.ts' )
})

// it should work 
//  interface reqRes {
//   req:Request,
//   res:Response
// }

 
route.post('/signup',async (req,res)=>{
  try {
    
    const {username, password, firstname, lastname} = req.body
    const zodVerfify = signUpSchema.safeParse(req.body)
    
    const alreadyExist = await prisma.user.findUnique({
    where:{username}
  })
  
  if (!zodVerfify.success) { 
    console.log(zodVerfify); 
    return res.json({message:"make sure to add correct email"})
  }
  
  if (alreadyExist) { 
    return res.json({message:"username already exist , try something unique"})
  }
  
  const user = await prisma.user.create({
    data:{username,password,firstname,lastname} 
  })
 
  const token = jwt.sign({userId:user.id},secret)
  
  res.json({message:"User created successfully",token:token})
} catch (error) {
  return res.json({message:"Backend Route Error"})
}
})

route.post('/signin',async (req:Request,res:Response)=>{ 
  try {
    const {username, password} = req.body
    const zodVerfify = signinSchema.safeParse(req.body)
    
    const exist = await prisma.user.findUnique({
      where:{username}
    })
    const user = await prisma.user.findUnique({
      where:{username,password}
    })
     
    if (!zodVerfify.success) {
      console.log(zodVerfify); 
      return res.json({message:"make sure to add correct email"})
    }
    
    if (!exist) {
      return res.json({message:"User doesn't exist"})
    }
    
    if (!user) {
      return res.json({message:"Invalid Credentials"})
  }
  
  console.log(exist);
  
  const token = jwt.sign({userId:user.id},secret) 
  res.json({message:"Fetching details...",token:token, firstname:user.firstname})
  
} catch (error) {
  return res.json({message:"Backend is down",Error:error})
  }
})

route.put('/',userAuth,async (req:Request,res)=>{
  const {firstname,lastname} = req.body
  const update = req.userId
  
  await prisma.user.update({
    where:{id:req.userId},
    data:{firstname,lastname}
  })
 res.json({message:"Details updated sucessfully!"}) 
})

// initializing multer
const storage = multer.memoryStorage()
const upload = multer({ storage: storage})

route.post('/upload',userAuth,upload.single('file'), async(req:any,res:Response)=>{
    // pdfs will be uploaded to this route
    try {
      const filepath = 'testing' 
      
      if (!req.file) {
        console.log("no file");
        
        return res.json({message:"File is not uploaded"})
      }
      const {originalname, buffer} = req.file      
      console.log(req.file);
      
      console.log("filename: "+originalname);
      const already = await prisma.file.findUnique({
        where:{filename:originalname}
      })
    if (already) {
      return res.json({message:"File already exist"})
    }
    else{  
      const resposne = await prisma.file.create({  
        data:{ 
          filename:originalname,
          userId:req.userId,
          mimettype:req.file.mimetype,
          encoding:req.file.encoding,
          data:buffer,
          date:new Date(),
          time:new Date()
        }
      }) 
      console.log("date: "+resposne.date.getDate()); 
      console.log("time: "+resposne.date); 
      
      res.json({message:"Report is uploaded successfully! ", data:{filename:resposne.filename,data:resposne.data}})
 
    }
  } catch (error) {
    res.json({message:"No such file in the directory",Error:error})
    console.log(error);
  }
})
 
route.post('/reports',userAuth,async(req:Request,res)=>{ 
  try {
    
    const response = await prisma.user.findUnique({
      where:{id:req.userId},
      include:{
        files:{
          select:{
            filename:true,
            data:true, 
            date:true
          }
        } 
      }
    })
    if (response==null) { 
      return res.json({message:'You have no files'})
    }

    if (response.files.length==0) {
     return res.json({message:"You have no reports"})
    } 
    const files = response.files.map((file) => ({
      filename: file.filename,
      date: new Date(file.date).toString()// Assuming file.date is a Date object
    }));
    console.log(files);
    

    res.json(files);
  } catch (error) {
    res.json({message:"No resports associated with username: "})
  }
})

 

route.post('/pdf', userAuth, async (req: any, res: Response) => {
  const { filename } = req.body;
  console.log(req.userId);
  
  const user = await prisma.user.findUnique({
    where: { id:req.userId },
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
      read() {}
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


route.get('/',userAuth) 
export {route, secret} 