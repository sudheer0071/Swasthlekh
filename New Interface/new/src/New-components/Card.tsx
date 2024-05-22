export const Card = ({image,title,content}:{image:string, title:string, content:string})=>{
  return <div>
    <div className=" max-w-sm md:mt-10 p-6">
              <div className=" w-52 mx-3">
                <img src={image} alt="" />
              </div>
              <div className=" text-2xl md:text-3xl">
              {title}
              </div>
              <div className=" mt-9">
             {content}
              </div>
            </div>
  </div>
}