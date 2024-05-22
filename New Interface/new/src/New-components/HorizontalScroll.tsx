import  { useRef, useState } from 'react';

const HorizontalScroll = ({ children }:any) => {
  const scrollContainerRef = useRef(null);
  const [isDown, setIsDown] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleMouseDown = (e:any) => {
    const scrollContainer:any = scrollContainerRef.current;
    setIsDown(true);
    setStartX(e.pageX - scrollContainer.offsetLeft);
    setScrollLeft(scrollContainer.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsDown(false);
  };

  const handleMouseUp = () => {
    setIsDown(false);
  };

  const handleMouseMove = (e:any) => {
    if (!isDown) return;
    e.preventDefault();
    const scrollContainer:any = scrollContainerRef.current;
    const x = e.pageX - scrollContainer.offsetLeft;
    const walk = (x - startX) * 1; // Adjust the multiplier for faster or slower scrolling
    scrollContainer.scrollLeft = scrollLeft - walk;
  };

  return (
    <div
      ref={scrollContainerRef}
      onMouseDown={handleMouseDown}
      onMouseLeave={handleMouseLeave}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
      className="scroll flex" 
    >
      {children}
    </div>
  );
};

export default HorizontalScroll;
