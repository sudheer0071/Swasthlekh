import express,{Express, Response, Request} from 'express'
import {router} from "./routes/index"
const app:Express = express() 
 
const PORT = 5000 
app.use(express.json())
app.use('/api/v3',router)

app.get('/',(req:Request,res:Response)=>{
   res.send("backend is working fine in index.ts")
})

app.listen(PORT,()=>{
  console.log(`server is listening at http://localhost:${PORT}`); 
})

 