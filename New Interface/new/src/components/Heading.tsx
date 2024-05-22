type props = {text:string}
export function Heading({text}:props){
  return <div className=" text-left font-bold text-4xl pt-6"> 
  {text} 
  </div>
}