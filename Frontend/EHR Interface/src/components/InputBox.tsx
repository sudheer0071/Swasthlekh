 
type props = {
  placeholder:string,
  label:string,
  onChange:any,
  password:string,
  value:string,
  empty:boolean
}

export function InputBox({onKeyPress, placeholder, label, onChange, password, value, empty}:any){       
  return <div> 
      <div className="text-md font-medium text-left py-2">
        {label}
      </div>
      <input onChange={onChange} onKeyDown={onKeyPress} value={value} className={`${empty?'error':''} text-lg shadow-md w-full px-2 border rounded h-12 font-medium border-slate-200 py-1 bg-white border-1`} type={password?'password':"text"} placeholder={placeholder} />
  </div>
}