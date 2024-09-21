export const ReviewCard = ({name, review}:{name:string, review:string})=>{
  return <div className=" flex max-w-[264px] md:max-w-sm mx-3 flex-none text-white">
    <div className=" review rounded-xl p-4 md:p-9 "> 
    <div className="  p-4">
    <div className=" text-2xl md:text-3xl font-medium">
    {name} 
    </div>
    <div className=" mt-4">
     {review}
    </div>  
    </div>
    </div>
  </div>
}