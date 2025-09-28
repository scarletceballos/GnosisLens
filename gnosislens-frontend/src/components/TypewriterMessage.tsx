"use client";

import React, { useState, useEffect } from "react";

interface TypewriterMessageProps {
  text: string;
  speed?: number;
  className?: string;
  onComplete?: () => void;
}

const TypewriterMessage: React.FC<TypewriterMessageProps> = ({
  text,
  speed = 30, // Faster default speed for chat messages
  className = "",
  onComplete
}) => {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    let currentIndex = 0;
    setDisplayedText("");

    const intervalId = setInterval(() => {
      if (currentIndex < text.length) {
        setDisplayedText((prev) => prev + text[currentIndex]);
        currentIndex++;
      } else {
        clearInterval(intervalId);
        if (onComplete) onComplete();
      }
    }, speed);

    return () => clearInterval(intervalId);
  }, [text, speed, onComplete]);

  return <span className={className}>{displayedText}</span>;
};

export default TypewriterMessage;
