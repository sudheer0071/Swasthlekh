import { useState } from 'react';
import { Document, Page } from 'react-pdf';  
import { ZoomIn, ZoomOut } from 'lucide-react';

function PdfComp({content}:any) {
  const [numPages, setNumPages] = useState<number>(); 
  const [scale, setScale] = useState<number>(1.0);
  // console.log(pageNumber);
  
  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    setNumPages(numPages);
  }
// console.log(setPageNumber);

  function zoomIn() {
    setScale(scale + 0.1);
  }

  function zoomOut() {
    setScale(scale - 0.1);
  }
// console.log(setPageNumber);

  return (
    <div className='pdf p-5 '>
      <div className=' flex justify-center'>
      <div className='fixed top-24 flex justify-center items-end'>
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
      <div className='pdf-container flex justify-center w-full'>
        <Document file={content} onLoadSuccess={onDocumentLoadSuccess}>
          {Array.from(new Array(numPages), (_, index) => (
            <Page key={`page_${index + 4}`} pageNumber={index + 1} scale={scale} renderTextLayer={false} renderAnnotationLayer={false} />
          ))}
        </Document>
      </div>
    </div>
  );
}


export {PdfComp}