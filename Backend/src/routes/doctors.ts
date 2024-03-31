import express, { Express, Request, Response, Router } from 'express';
import { signinSchema, signUpSchema } from '../zodAuth';
import { PrismaClient } from '@prisma/client';
import { userAuth } from '../middleware';
import fs from 'fs'
import path from 'path';
import { Readable } from 'stream';
import axios from 'axios';


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
  res.json({ message: "Fetching details...", token: token, firstname: user.firstname })
})

route1.post('/reports', userAuth, async (req: Request, res) => {
  try {

    const { username } = req.body
    console.log("patients id: " + username.username);

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
      return res.json({ message: 'user with username: "' + username + '" does not exist in database' })
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
           date:new Date,
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
  const newLog = await prisma.logs.create({
    data: {
      userEmail: username,
      doctorEmail: doc.username,
      accessedFiles: {
        create: {
          actions:actions,
          date: new Date,
          filename
        },
      },
    },
  });
  console.log("new log: "+newLog);
  
 }

  // console.log("createing log... "+ logs);
  
});


export { route1 }