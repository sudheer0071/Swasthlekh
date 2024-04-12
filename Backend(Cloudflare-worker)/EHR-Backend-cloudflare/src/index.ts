import { Hono } from 'hono'
import { router } from '../../EHR-Backend-cloudflare-test/src/routes'
import { PrismaClient } from '@prisma/client'
import { withAccelerate } from '@prisma/extension-accelerate'
import { signupSchema } from '../../EHR-Backend-cloudflare-test/src/zodAuth'

const prisma = new PrismaClient().$extends(withAccelerate())

const app = new Hono()

app.route('/api',router)

app.get('/', (c) => {
  return c.text("backend is working fine for index.ts")
})

app.post('/signup',async(c)=>{
  const {firstname,lastname,username,password} = await c.req.json()
  const zodVerify = signupSchema.safeParse(c.req.json())

  if (!zodVerify.success) {
    return c.json({message:"make sure to add correct email and pass"})
  }

  const user = await prisma.user.create({
    data:{
      firstname,lastname,username,password
    }
  })
  console.log("created user: "+user);
  c.json({message:"User is created successfully! "})
  
})
export default app
