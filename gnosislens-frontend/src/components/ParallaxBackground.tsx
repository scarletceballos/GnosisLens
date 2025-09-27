"use client";

import { useEffect, useState } from 'react';
import Image from 'next/image';
import MovingClouds from './MovingClouds';

const ParallaxBackground = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Calculate mouse position as a percentage of the viewport
      // Using a larger multiplier for background (deeper effect)
      const x = (e.clientX / window.innerWidth) * 10; 
      const y = (e.clientY / window.innerHeight) * 10;
      
      // Smooth transition for the movement
      setPosition({ x, y });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);
  
  return (
    <>
      <div className="fixed inset-0 w-full h-full overflow-hidden -z-10">
        {/* The negative margin and scale create the "zoomed in" effect */}
        <div 
          className="w-[110%] h-[110%] absolute top-[-5%] left-[-5%] transition-transform duration-200 ease-out"
          style={{ 
            transform: `translate(${-position.x / 20}%, ${-position.y / 20}%)` 
          }}
        >
          <Image
            src="/images/background.png" 
            alt="Background"
            fill
            sizes="100vw"
            priority
            className="object-cover"
            quality={100}
          />
        </div>
        
        {/* Optional overlay for better text readability */}
        <div className="absolute inset-0 bg-black/10"></div>
      </div>
      
      {/* Add the moving clouds layer */}
      <MovingClouds />
    </>
  );
};

export default ParallaxBackground;
