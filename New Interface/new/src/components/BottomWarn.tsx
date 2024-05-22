import {Link} from "react-router-dom"

type props = {
  label:string,
  link:string,
  linktext:string
}

export function BottomWarn({label, link, linktext}:props){
  return <div className="flex justify-center py-2 text-md font-medium">
    <div>
    {label} 
    </div>
     <Link className=" text-slate-700 underline pl-1 cursor-pointer" to={link}>
     {linktext}
     </Link>
  </div>
}