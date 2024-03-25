type props = {text:string}

export function SubHeading({text}:props){
  return <div>
    <div className="text-slate-500 text-md pt-1 px-4 pb-4">
      {text}
    </div>
  </div>
}