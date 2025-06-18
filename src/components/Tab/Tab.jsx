import React, { useState } from 'react';

export default function Tab({ options, active, onChange }) {
  return (
    <div className="flex space-x-2 border-b mb-4">
      {options.map((option) => (
        <button
          key={option}
          onClick={() => onChange(option)}
          aria-label={`Status tab ${option}`}
          className={`pb-2 px-1 sm:px-4 border-b-2 capitalize ${active === option ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500'}`}
        >
          {option}
        </button>
      ))}
    </div>
  );
}
