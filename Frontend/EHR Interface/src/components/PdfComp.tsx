import { useState } from 'react';
import { Document, Page } from 'react-pdf';
import pdf from  '../pdfs/DS-unit1 part2.pdf'
import { Button } from './Button';

function PdfComp({content}:any) {
  const [numPages, setNumPages] = useState<number>();
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.0);
  
  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    setNumPages(numPages);
  }

  function zoomIn() {
    setScale(scale + 0.1);
  }

  function zoomOut() {
    setScale(scale - 0.1);
  }

  return (
    <div className='pdf p-10 flex flex-col justify-center items-center'>
      <div className='zoom-buttons flex flex-col borde'>
        <div className='flex -mt-2'>
        <div className='px-2 rounded-lg'>
        <Button height={8} loader={''}  label={"+"} onclick={()=>zoomIn()}></Button>
        </div>
        <div className='flex'>
        <Button height={8} loader={''} label={"__"} onclick={()=>zoomOut()}></Button>
        </div>
        </div>
        <div className='flex'>
      <p className='text-zinc-600 font-medium text-lg border rounded-md bg-slate-400 px-4 -ml-4 -mt-2'>
        Page {pageNumber} of {numPages}
      </p>
        </div>
      </div>
      <div className='pdf-container'>
        <Document file={content} onLoadSuccess={onDocumentLoadSuccess}>
          {Array.from(new Array(numPages), (l, index) => (
            <Page key={`page_${index + 4}`} pageNumber={index + 1} scale={scale} renderTextLayer={false} renderAnnotationLayer={false} />
          ))}
        </Document>
      </div>
    </div>
  );
}


export {PdfComp}