type props = {text:string}
export function Heading({text}:props){
  return <div className="font-bold text-4xl pt-6"> 
  {text} 
  </div>
}