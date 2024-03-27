import express,{Express, Request, Response, Router} from 'express';
import {signinSchema,signUpSchema} from '../zodAuth';
import { PrismaClient } from '@prisma/client'; 
import { userAuth } from '../middleware';
import { strict } from 'assert';  
import fs from 'fs'
import multer from 'multer'
import { NextApiRequest } from 'next';

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
          data:buffer
        }
      })
      console.log(res);
 
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
            data:true
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
    console.log(response);
    const filenames = response.files.map(file=>file.filename)
    console.log(filenames);
    
    res.json({filename:filenames})
  } catch (error) {
    res.json({message:"No resports associated with username: "})
  }
})


route.get('/pdf',userAuth,async (req:any,res:Response)=>{ 
  
  const user = await prisma.user.findUnique({
    where:{id:req.userId},
    include:{
      files:{
        select:{
          filename:true,
          data:true 
        }
      }
  }})
if (!user) {
  return res.json({message:"User not found"})
}
  const pdf = user?.files.forEach((file)=>{
    fs.writeFileSync(`${file.filename}.pdf`,Buffer.from(file.data))
  })
  console.log(pdf);
  
  res.json({pdf:pdf})
  
})

route.get('/',userAuth) 
export {route, secret} 