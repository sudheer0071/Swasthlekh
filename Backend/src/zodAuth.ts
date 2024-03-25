import  zod  from "zod" 
 
const signUpSchema = zod.object({ 
   firstname:zod.string(),
   lastname:zod.string().optional(),
   username:zod.string().email(),
   password:zod.string().min(5)
})
 
const signinSchema = zod.object({  
   username:zod.string().email(),
   password:zod.string().min(5)
})

export  {signUpSchema,signinSchema}