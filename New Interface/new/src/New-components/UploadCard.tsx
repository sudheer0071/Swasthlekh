import { BotMessageSquare, ClipboardMinus, Download } from "lucide-react" 

export const UploadCard =()=>{
  return <div className=" border-b-2 p-2 flex justify-between">
    <div className=" flex">
      <div>
        <ClipboardMinus/>
      </div>
      <div className=" ml-2 font-mono">
      mri_scan
      </div>
    </div>
    <div className=" rounded-full items-center flex">
      <div className=" px-2 bg-orange-100 font-bold text-orange-800">
        PDF
      </div>
    </div> 
    <div className=" flex flex-col">
      <div className=" font-medium">
        Uploaded on
      </div>
      <div className=" font-light">
        26 Mar 2023, 3:34 Pm
      </div>
    </div>
    <div className=" flex">
      <div>
       < Download/>
      </div>
      <div className=" ml-7">
        <BotMessageSquare/>
      </div>
    </div>
  </div>
}