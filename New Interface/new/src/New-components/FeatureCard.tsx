export const FeatureCard = ({image, title, content}:{image?:string, title?:string, content?:string})=>{
  return <div className=" inline-block max-w-sm lg:max-w-md mx-3 flex-none">
    <div className="feature flex flex-col bg-white rounded-xl h-full max-w-[294px] md:max-w-md">
    <div >
      <img className=" w-full rounded-t-xl" src={image} alt="" />
    </div>
    <div className=" p-4">
    <div className=" text-2xl md:text-3xl font-serif">
    {title} 
    </div>
    <div className=" mt-4">
     {content}
    </div>
    <div className=" font-semibold underline mt-3">
      <a href="google.com">Learn more</a>
    </div>
    </div>
    </div>
  </div>
}