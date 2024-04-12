import zod from 'zod'

const signupSchema = zod.object({
  firstname:zod.string(),
  lastname:zod.string().optional(),
  username:zod.string().email(),
  password:zod.string().min(5)
})

const signinSchema = zod.object({ 
  username:zod.string().email(),
  password:zod.string().min(5)
})

export {signinSchema,signupSchema}