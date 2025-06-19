import { useState, useRef, useEffect } from 'react';

const DropdownList = ({ id, label, renderLabel, options = [], value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);

  const selected = options.find((opt) => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target) &&
        !buttonRef.current.contains(e.target)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (option) => {
    onChange(option.value);
    setIsOpen(false);
  };

  return (
    <div className="relative w-fit" ref={dropdownRef}>
      {label && (
        <label htmlFor={`${id}-button`} className="block mb-1 text-sm font-medium text-gray-300">
          {label}
        </label>
      )}
      <button
        id={`${id}-button`}
        ref={buttonRef}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen((prev) => !prev);
          return;
        }}
        className="max-w-fit p-0 text-left bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {renderLabel && selected?.label && renderLabel(selected?.label)}
        {!renderLabel && selected?.label}
        {!selected?.label && 'Select...'}
      </button>

      {isOpen && (
        <ul
          role="listbox"
          className="absolute z-10 max-w-fit mt-1 bg-[#38A281] rounded shadow-lg text-gray-200"
        >
          {options.map((opt) => (
            <li
              key={opt.value}
              role="option"
              aria-selected={opt.value === value}
              tabIndex={0}
              onClick={(e) => {
                e.stopPropagation();
                handleSelect(opt);
              }}
              onKeyDown={(e) => e.key === 'Enter' && handleSelect(opt)}
              className={`cursor-pointer px-4 py-2 hover:bg-gray-700 ${
                opt.value === value ? 'bg-gray-700' : ''
              }`}
            >
              {opt.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DropdownList;
