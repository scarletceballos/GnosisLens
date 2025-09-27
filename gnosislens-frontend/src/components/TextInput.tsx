"use client";

import React from 'react';

interface TextInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyPress?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  placeholder?: string;
  disabled?: boolean;
}

const TextInput: React.FC<TextInputProps> = ({
  value,
  onChange,
  onKeyPress,
  placeholder = "Ask the Oracle...",
  disabled = false
}) => {
  return (
    <input
      type="text"
      value={value}
      onChange={onChange}
      onKeyPress={onKeyPress}
      placeholder={placeholder}
      disabled={disabled}
      className={`w-full px-4 py-2 rounded-lg bg-black/20 dark:bg-black/30 backdrop-blur-sm
                 border-none
                 text-amber-100 placeholder:text-amber-300/40
                 focus:outline-none focus:ring-1 focus:ring-amber-500/30 z-10
                 disabled:opacity-70 disabled:cursor-not-allowed
                 transition-all duration-200 focus:scale-[1.01] pr-10`}
      autoComplete="off"
      autoCorrect="off"
      spellCheck="false"
    />
  );
};

export default React.memo(TextInput);
