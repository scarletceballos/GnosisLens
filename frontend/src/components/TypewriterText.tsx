"use client";

import React, { useState, useEffect } from "react";

interface TypewriterTextProps {
  text: string;
  speed?: number;
  className?: string;
  onComplete?: () => void;
  as?: React.ElementType;
}

const TypewriterText: React.FC<TypewriterTextProps> = ({
  text,
  speed = 50,
  className = "",
  onComplete,
  as: Component = "span" // Change default from paragraph to span
}) => {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    if (displayedText === text && onComplete) {
      onComplete();
    }
  }, [displayedText, text, onComplete]);

  useEffect(() => {
    let currentIndex = 0;
    setDisplayedText("");

    const intervalId = setInterval(() => {
      if (currentIndex < text.length) {
        setDisplayedText((prev) => prev + text[currentIndex]);
        currentIndex++;
      } else {
        clearInterval(intervalId);
      }
    }, speed);

    return () => clearInterval(intervalId);
  }, [text, speed]);

  return <Component className={className}>{displayedText}</Component>;
};

export default TypewriterText;