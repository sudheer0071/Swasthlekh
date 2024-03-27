import { useState } from 'react';
import { Document, Page } from 'react-pdf';
import pdf from  '../pdfs/DS-unit1 part2.pdf'

function PdfComp() {
  const [numPages, setNumPages] = useState<number>();
  const [pageNumber, setPageNumber] = useState<number>(1);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    setNumPages(numPages);
  }

  return (
    <div className='pdf p-10 flex flex-col justify-center'>
    <p className='flex justify-center text-zinc-600'>
      Page {pageNumber} of {numPages}
    </p>
    <Document file={pdf} onLoadSuccess={onDocumentLoadSuccess}>
      {Array.from(new Array(numPages), (l, index) => (
        <Page key={`page_${index + 1}`} pageNumber={index + 1} renderTextLayer={false} renderAnnotationLayer={false} />
      ))}
    </Document>
  </div>
);

}

export {PdfComp}