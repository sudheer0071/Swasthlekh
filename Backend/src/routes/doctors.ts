import express,{Express, Request, Response, Router} from 'express';
import {signinSchema,signUpSchema} from '../zodAuth';
import { PrismaClient } from '@prisma/client'; 
import { userAuth } from '../middleware';
import { strict } from 'assert';
import fs from 'fs'
import path from 'path';

const jwt = require('jsonwebtoken')
const route1:Router  = express.Router()
const prisma = new PrismaClient()

const secret = '1234hjkl'
route1.get('/doc',(req:Request,res:Response)=>{
  res.send( 'yoo backend is running in doctor.ts' )
})

route1.post('/signup',async (req,res)=>{
  const {username, password, firstname, lastname} = req.body
  const zodVerfify = signUpSchema.safeParse(req.body)
   
  const alreadyExist = await prisma.doctor.findUnique({
    where:{username}
  })
  
  if (!zodVerfify.success) { 
    console.log(zodVerfify); 
    return res.json({message:"make sure to add correct email"})
  }
  
  if (alreadyExist) { 
    return res.json({message:"username already exist , try something unique"})
  }
  
  const user = await prisma.doctor.create({
    data:{username,password,firstname,lastname} 
  })
 
  const token = jwt.sign({userId:user.id},secret)
  
  res.json({message:"User created successfully",token:token})
})

route1.post('/signin',async (req:Request,res:Response)=>{ 
  const {username, password} = req.body
  const zodVerfify = signinSchema.safeParse(req.body)
   
  const exist = await prisma.doctor.findUnique({
    where:{username}
  })
  const user = await prisma.doctor.findUnique({
    where:{username,password}
  })
  
  if (!zodVerfify.success) {
    console.log(zodVerfify); 
    return res.json({message:"make sure to add correct email"})
  }
  
  if (!exist) {
    return res.json({message:"User doesn't esixt"})
  }
  
  if (!user) {
    return res.json({message:"Invalid Credentials"})
  }
  
  console.log(exist);
   
  const token = jwt.sign({userId:user.id},secret) 
  res.json({message:"Fetching details...",token:token,firstname:user.firstname})
})

route1.post('/reports',userAuth,async(req,res)=>{
  try {
    
    const {username} =  req.body
    const response = await prisma.user.findUnique({
      where:{username},
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
      return res.json({message:'user with username: "'+username+'" does not exist in database'})
    }

    if (response.files.length==0) {
     return res.json({message:"No resports associated with username: "+username})
    }
    console.log(response);
    res.json({filename:response?.files})
  } catch (error) {
    res.json({message:"No resports associated with username: "+req.body})
  }
})


route1.get('/pdf',userAuth,async (req:any,res:Response)=>{
  const {username,filename} = req.body 
  console.log(username);
  
  const user = await prisma.user.findUnique({
    where:{username},
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
const downloadPath = 'src\\downloads'

if (!fs.existsSync(downloadPath)) {
  fs.mkdirSync(downloadPath, { recursive: true }); 
}

const fileExist = await prisma.file.findUnique({where:{filename}})

if (!fileExist) {
  return res.json({message:"File doesn't exist in database"})
}
else{
  const pdf =  user.files.filter((file)=>{
    const filePath = path.join(downloadPath, filename); 
    if (file.filename==filename) {
      fs.writeFileSync(filePath, Buffer.from(file.data)); 
      } 
    })
    // res.send(fs.writeFileSync())
    console.log(pdf);
    
    res.json({message:"file downloaded successfully!",pdf:pdf})
}
}) 

export {route1}