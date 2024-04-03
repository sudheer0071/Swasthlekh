import express,{Express, Response, Request, Router} from 'express'
const { route } = require('./users') 
const { route1 } = require('./doctors')

const router:Router = express.Router()  


router.use('/users',route)
router.use('/doctors',route1)

router.get('/',(req:Request, res:Response)=>{
  res.send("backend is working fine for index.js route inside routes folders")
})
export {router}  


 