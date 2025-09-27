"use client";

import React, { useEffect, useState } from "react";


type Props = {
  value?: string;
  onChange?: (val: string) => void;
  placeholder?: string;
  label?: string;
  className?: string;
  name?: string;
};


export default function TextInput({ value, onChange, placeholder = "", label, className = "", name }: Props) {
  const [internal, setInternal] = useState<string>(value ?? "");

  useEffect(() => {
    if (value !== undefined) setInternal(value);
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInternal(e.target.value);
    onChange?.(e.target.value);
  };

  return (
    <label className={`flex flex-col gap-2 ${className}`}>
      {label && <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{label}</span>}
      <input
        name={name}
        value={internal}
        onChange={handleChange}
        placeholder={placeholder}
        className="px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
      <div className="text-xs text-gray-500 dark:text-gray-400">Typed: {internal}</div>
    </label>
  );
}
