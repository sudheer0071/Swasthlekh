import { useState } from 'react';
import { Document, Page } from 'react-pdf';  
import { ZoomIn, ZoomOut } from 'lucide-react';
import {useMediaQuery} from 'react-responsive'

function PdfComp({content}:any) {
  const [numPages, setNumPages] = useState<number>(); 
  const [scale, setScale] = useState<number>(1.0);
  // const [mini, setMini] = useState(false)
  // console.log(pageNumber);
  const mini = useMediaQuery({query:'(max-width:450px)'})
  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    setNumPages(numPages);
  }
// console.log(setPageNumber);

// const handleResize = ()=>{
//   if (window.innerWidth<450) {
//     setMini(true)
//   }else{
//     setMini(false)
//   }
// }

// useEffect(()=>{
//   handleResize()

//   window.addEventListener('resize', handleResize);

//   return()=>{
//     window.removeEventListener('resize',handleResize)
//   }
// })

  function zoomIn() {
    setScale(scale + 0.1);
  }

  function zoomOut() {
    setScale(scale - 0.1);
  }
// console.log(setPageNumber);

  return (
    <div className='pdf p-5 w-60 md:w-full lg:w-full '>
      <div className=' flex justify-center'>
      <div className='fixed right-0 lg:right-auto z-30 top-20 md:top-24 lg:top-24 flex justify-center items-end'>
        <div className='flex -mt-2'>
        <div onClick={zoomIn} className='px-2 cursor-pointer rounded-lg'>
          <ZoomIn color='black' /> 
        </div>
        <div onClick={zoomOut} className=' ml-4 cursor-pointer flex'>
          <ZoomOut color='black'/> 
        </div>
        </div> 
        <div className=''>
      <p className='text-zinc-600 font-medium text-lg border rounded-md  px-4 mt-2'>
        Pages {numPages}
      </p>
        </div>
      </div>
      </div>
      <div className=' max-h-screen ml-7 lg:ml-0 md:ml-0 w-full'>
      <div className='pdf-container relative -z-0 md:flex lg:flex justify-center w-full'>
        <Document file={content} onLoadSuccess={onDocumentLoadSuccess}>
          {Array.from(new Array(numPages), (_, index) => (
            <Page key={`page_${index + 4}`} pageNumber={index + 1} scale={mini?scale-0.6:scale} renderTextLayer={false} renderAnnotationLayer={false} />
          ))}
        </Document>
      </div>
      </div>
    </div>
  );
}


export {PdfComp}