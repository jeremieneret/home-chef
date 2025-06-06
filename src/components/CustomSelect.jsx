import React, { useState, useRef, useEffect } from "react";

function CustomSelect({ options, value, onChange, placeholder = "Select an option" }) {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);

  const handleToggle = () => setIsOpen((prev) => !prev);
  const handleOptionClick = (optionValue) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  // Ferme le select lorsqu'on clique à l'extérieur
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find((option) => option.value === value);

  return (
    <div className="custom-select" ref={wrapperRef}>
      <div className="custom-select-selected" onClick={handleToggle}>
        {selectedOption ? selectedOption.label : placeholder}
      </div>
      {isOpen && (
        <ul className="custom-select-options">
          {options.map((option) => (
            <li
              key={option.value}
              className="custom-select-option"
              onClick={() => handleOptionClick(option.value)}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default CustomSelect;
