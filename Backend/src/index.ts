import express,{Express, Response, Request} from 'express'
import {router} from "./routes/index"
import cors from 'cors';
require('dotenv').config()

const app:Express = express() 
 
const PORT = process.env.PORT 
 
app.use(cors())

app.use(express.json())
app.use('/api/v3',router)

app.get('/',(req:Request,res:Response)=>{
   res.send("backend is working fine in index.ts --> UPDATED")
})

app.listen(PORT,()=>{
  console.log(`server is listening at http://localhost:${PORT}`); 
})

export default app 
        