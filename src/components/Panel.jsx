import React from 'react';

export default function Panel({ children, className }) {
  return (
    <div
      className={`max-w-md mx-auto mt-10 p-6 shadow-lg rounded-2xl bg-gradient-panel ${className}`}
    >
      {children}
    </div>
  );
}
