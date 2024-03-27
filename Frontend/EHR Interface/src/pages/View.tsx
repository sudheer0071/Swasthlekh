import { Button } from "../components/Button"
import { Heading } from "../components/Heading"
import { InputBox } from "../components/InputBox"


export function View(){
  return <div className="text-slate-600">
    <Heading text="This is view page"></Heading>
    <div id="pdf-content" className="flex justify-center rounded-lg bg-slate-400 border w-full h-96 mt-8 text-white">
        pdf conent
    </div>
    <div className="mt-7">
      <h1>Suggestions</h1>
    <div id="suggested Response" className="flex justify-center rounded-lg bg-slate-300 border w-full h-60 mt-8 text-white">
        pdf conent
    </div>
    </div>
 <div className="flex justify-center px-9 mt-1">
  <div className="w-full p-1 ml-7">
      <InputBox label={''}/>
  </div>
  <div className="mt-1 w-24">
      <Button onclick={''} loader={''} label={'Send'}></Button>
  </div>
    </div>


  </div>
} 