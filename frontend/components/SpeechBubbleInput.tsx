import React, { useRef } from "react";
import "./SpeechBubbleInput.css"; // we'll add styles here

interface SpeechBubbleInputProps {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
}

const SpeechBubbleInput: React.FC<SpeechBubbleInputProps> = ({
  placeholder = "Type here...",
  value,
  onChange,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div
      className="speech-bubble-input"
      onClick={() => inputRef.current?.focus()} // focus input when bubble is clicked
    >
      <input
        ref={inputRef}
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
      />
    </div>
  );
};

export default SpeechBubbleInput;