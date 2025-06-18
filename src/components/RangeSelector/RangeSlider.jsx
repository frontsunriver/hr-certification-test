import React, { useState } from 'react';
import { Range } from 'react-range';

export default function RangeSlider({ min, max, values, onChange, step }) {
  return (
    <div className="max-w-md mx-auto">
      <div className="flex justify-between text-xs text-gray-400 pb-2">
        <span>Min: ${values[0]}</span>
        <span>Max: ${values[1]}</span>
      </div>
      <Range
        values={values}
        step={step}
        min={min || 0}
        max={max || 1000}
        onChange={onChange}
        renderTrack={({ props, children }) => (
          <div
            {...props}
            className="h-2 bg-gray-600 rounded-md relative"
            style={{
              ...props.style,
              background: `linear-gradient(to right, #4B5563 ${((values[0] - min) / (max - min)) * 100}%, #3B82F6 ${((values[0] - min) / (max - min)) * 100}%, #3B82F6 ${((values[1] - min) / (max - min)) * 100}%, #4B5563 ${((values[1] - min) / (max - min)) * 100}%)`,
            }}
          >
            {children}
          </div>
        )}
        renderThumb={({ props }) => (
          <div
            {...props}
            className="w-5 h-5 bg-white rounded-full shadow border-2 border-blue-500"
          />
        )}
      />
    </div>
  );
}
