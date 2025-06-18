import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export default function DateInputBox({ className, ...props }) {
  const [date, setDate] = useState(null);

  return (
    <DatePicker
      selected={date}
      onChange={(date) => setDate(date)}
      placeholderText="Select your birthday"
      wrapperClassName="block w-full"
      className={`bg-[#38A2F124] text-[#FAFAFFCC] placeholder-[#FAFAFF80] outline-none px-4 py-2 rounded-md w-full ${className}`}
      {...props}
    />
  );
}
