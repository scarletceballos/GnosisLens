"use client";

import React, { useState, useEffect } from 'react';

// This is a simplified polyfill for framer-motion that works with React 19
export const motion = {
  div: React.forwardRef(({ initial, animate, transition, ...props }: any, ref: any) => {
    const [style, setStyle] = useState(initial || {});
    
    useEffect(() => {
      if (animate) {
        const timer = setTimeout(() => {
          setStyle(animate);
        }, 10);
        return () => clearTimeout(timer);
      }
    }, [animate]);
    
    // Convert framer-motion props to CSS
    const cssTransition = transition 
      ? `all ${transition.duration || 0.3}s ${transition.type === 'spring' ? 'cubic-bezier(0.34, 1.56, 0.64, 1)' : 'ease'}`
      : 'all 0.3s ease';
      
    return (
      <div 
        ref={ref}
        {...props} 
        style={{ 
          ...props.style, 
          ...style, 
          transition: cssTransition
        }} 
      />
    );
  }),
  
  button: React.forwardRef(({ whileHover, whileTap, ...props }: any, ref: any) => {
    const [isHovered, setIsHovered] = useState(false);
    const [isPressed, setIsPressed] = useState(false);
    
    // Compute dynamic styles based on hover/press states
    const dynamicStyle = {
      ...(isHovered && whileHover ? whileHover : {}),
      ...(isPressed && whileTap ? whileTap : {})
    };
    
    return (
      <button
        ref={ref}
        {...props}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onMouseDown={() => setIsPressed(true)}
        onMouseUp={() => setIsPressed(false)}
        style={{
          ...props.style,
          ...dynamicStyle,
          transition: 'all 0.2s ease'
        }}
      />
    );
  })
};

export const AnimatePresence = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};
