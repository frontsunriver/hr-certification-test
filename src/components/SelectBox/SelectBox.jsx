import React from 'react';

export default function SelectBox({ options, className, ...props }) {
  return (
    <select
      className={`bg-[#38A2F124] text-[#FAFAFFCC] placeholder-[#FAFAFF80] outline-none px-4 py-2 rounded-md w-full capitalize ${className}`}
      {...props}
    >
      {options.map((item) => (
        <option key={item.value} value={item.value} className="text-sky-900 ">
          {item.label}
        </option>
      ))}
    </select>
  );
}
