"use client";

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

const MovingClouds = () => {
  const firstContainerRef = useRef<HTMLDivElement>(null);
  const secondContainerRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    if (!firstContainerRef.current || !secondContainerRef.current) return;
    
    const firstContainer = firstContainerRef.current;
    const secondContainer = secondContainerRef.current;
    
    let animationId: number;
    let position1 = 0;
    let position2 = 100; // Start the second container at the right edge
    
    // Handle mouse movement for parallax effect
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 5;
      const y = (e.clientY / window.innerHeight) * 5;
      setMousePosition({ x, y });
    };
    
    // Animation function with seamless looping
    const animate = () => {
      // Much slower movement for a more subtle effect
      position1 -= 0.008;
      position2 -= 0.008;
      
      // When first container is fully offscreen to the left, move it to the right
      if (position1 <= -100) {
        position1 = 100;
      }
      
      // When second container is fully offscreen to the left, move it to the right
      if (position2 <= -100) {
        position2 = 100;
      }
      
      // Apply transforms separately to each container
      firstContainer.style.transform = `translateX(${position1}%) translate(${mousePosition.x / 40}%, ${mousePosition.y / 40}%)`;
      secondContainer.style.transform = `translateX(${position2}%) translate(${mousePosition.x / 40}%, ${mousePosition.y / 40}%)`;
      
      animationId = requestAnimationFrame(animate);
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    animationId = requestAnimationFrame(animate);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationId);
    };
  }, []);
  
  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden pointer-events-none" style={{ zIndex: -5 }}>
      {/* First cloud container */}
      <div 
        className="absolute inset-0 w-full h-[120%] -mt-[5%] transition-transform duration-[400ms] ease-out" 
        ref={firstContainerRef}
      >
        <Image
          src="/images/clouds.png"
          alt="Clouds"
          fill
          sizes="100vw"
          className="object-contain opacity-80"
          style={{ objectPosition: 'center' }}
        />
      </div>
      
      {/* Second cloud container (identical but starts at a different position) */}
      <div 
        className="absolute inset-0 w-full h-[120%] -mt-[5%] transition-transform duration-[400ms] ease-out" 
        ref={secondContainerRef}
      >
        <Image
          src="/images/clouds.png"
          alt="Clouds"
          fill
          sizes="100vw"
          className="object-contain opacity-80"
          style={{ objectPosition: 'center' }}
        />
      </div>
    </div>
  );
};

export default MovingClouds;
