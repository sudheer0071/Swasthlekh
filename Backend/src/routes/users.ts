import express,{Express, Request, Response, Router} from 'express';
import {signinSchema,signUpSchema} from '../zodAuth';
import { PrismaClient } from '@prisma/client'; 
import { userAuth } from '../middleware';
import { strict } from 'assert';
import fs from 'fs'
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
})

route.post('/signin',async (req:Request,res:Response)=>{ 
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

route.post('/upload',userAuth, async(req:any,res:Response)=>{
    // pdfs will be uploaded to this route
    try {
      
      const filepath = 'src/test files/b.txt'
      const filename = 'b.txt'
      const data = fs.readFileSync(filepath)
      const already = await prisma.file.findUnique({
        where:{filename:filename}
      })
    if (already) {
      return res.json({message:"File already exist"})
    }
    else{ 
      const resposne = await prisma.file.create({ 
        data:{ 
          filepath,
          filename,
          userId:req.userId,
          mimettype:'application/pdf', 
          encoding:'binary',
          data:data
        }
      })
      console.log(res);
 
      res.json({message:"Your pdf is added to database! ", data:{filename:resposne.filename,data:resposne.data}})


    }
  } catch (error) {
    res.json({message:"No such file in the directory",Error:error})
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