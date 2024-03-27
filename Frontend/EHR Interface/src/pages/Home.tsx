import MySVG from "../components/MySvg"
import { Reports } from "../components/Reports"
import { Upload } from "./Upload"

export function Home(){ 
  return <div>
    <div className="flex flex-col">
    <div id="navbar" className="flex justify-between">
      <div className="flex w-14 -mt-10">
       <MySVG/>
      </div>
      <div> 
  <h1>Logo</h1>
      </div>
      <div>
      <div className="flex flex-col justify-center bg-slate-500 rounded-full h-12 w-12 p-4 mr-3 mt-1">
        <div className="flex flex-col justify-center h-full text text-xl">
          {localStorage.getItem('firstname')?.charAt(0).toUpperCase()}
        </div>
      </div>
      </div>
    </div>
    <div id="new-features">
      <div className="flex justify-center h-96 rounded-lg bg-gradient-to-br from-blue-300 to-black  shadow-lg">
        <p className="m-auto">New Features</p>
        {/* Images or gifs goes here */}
      </div>
    </div>
     <div id="report-section">
       <h1 className="mt-10 p-3 my-5">Your past Reports</h1>
       <div id="reports-list" className="p-4 bg-zinc-400 rounded-lg shadow-lg h-80 overflow-x-hidden overflow-scroll scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100" >
          <Reports/>
       </div>
       <div id="upload" className="flex justify-center cursor-pointer mt-9">
        <Upload/>
       </div>
     </div>
    </div>
  </div>
}