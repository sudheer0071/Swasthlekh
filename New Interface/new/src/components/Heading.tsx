type props = {text:string, size?:number}
export function Heading({text, size=3}:props){
  return <div className= {`text-left font-bold ${size==1?' text-xl':`text-${size}xl`} pt-6`}> 
  {text} 
  </div>
}