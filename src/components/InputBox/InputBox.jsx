import React from 'react';

export default function InputBox({ value, onChange, placeholder, className, ...props }) {
  return (
    <input
      className={`bg-[#38A2F124] text-[#FAFAFFCC] placeholder-[#FAFAFF80] outline-none px-4 py-2 rounded-md w-full ${className}`}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      {...props}
    />
  );
}
