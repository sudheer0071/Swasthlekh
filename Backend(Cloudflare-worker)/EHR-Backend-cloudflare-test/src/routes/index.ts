import { Hono } from "hono";

const router = new Hono()

router.get('/',async (c)=>{
  c.text('backend is working fine for route index.ts')
})


export {router}