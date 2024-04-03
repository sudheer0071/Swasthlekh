 
import { Loader } from "./Loader"

type props = {
  onclick:any,
  label:String,
  loader:String,
  height:number
}

export function Button({height=2,onclick, label, loader}:props){
   
  return <div className="py-4">
    <button className={`loader h-${height} bg-slate-800 text-slate-100 py-2 px-3 rounded-md w-full focus:outline-none focus:ring-4 focus:ring-gray-300 hover:bg-slate-700 `} onClick={onclick}>{loader=='search'||loader=='signup'||loader=='signin'? 
     <Loader/> 
    : label} 
    </button> 
  </div>
}