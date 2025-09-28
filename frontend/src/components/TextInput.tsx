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
      className={`w-full px-4 py-2 rounded-lg bg-black/80 dark:bg-black/90
                 border border-gray-700 
                 text-gray-100 placeholder:text-gray-500
                 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600/30 z-10
                 disabled:opacity-70 disabled:cursor-not-allowed
                 transition-colors duration-200`}
      autoComplete="off"
      autoCorrect="off"
      spellCheck="false"
    />
  );
};

export default React.memo(TextInput);
