"use client";

import { useEffect } from 'react';

export default function CustomCursor() {
  useEffect(() => {
    // Apply custom cursor to the whole document
    document.documentElement.style.cursor = 'url(https://cur.cursors-4u.net/nature/nat-11/nat1010.cur), auto';
    
    // This effect runs only once when the component mounts
  }, []);

  return null; // This component doesn't render anything
}
