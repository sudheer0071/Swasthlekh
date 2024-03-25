import express,{Express, Response, Request, NextFunction} from 'express'

const jwt = require('jsonwebtoken')
import {secret} from './routes/users'

declare module 'express' {
  export interface Request {
     userId?: string;
  }
 }
  
async function userAuth(req:Request,res:Response, next:NextFunction, ) {
   const auth = req.headers.authorization
   if (auth!=null) {
     const token = auth.split(' ')[1]
     if (!auth || !auth.startsWith('Bearer ')) {
       return res.json({message:"Token error"})
     }
     try {
      const decode = jwt.verify(token,secret)
      req.userId = decode.userId
      console.log(req.userId);
      
      return next()
     } catch (error) {
      res.json({message:"Error"})
     }
   }

}

export {userAuth}