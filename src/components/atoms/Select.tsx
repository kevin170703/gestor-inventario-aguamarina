import { IconChevronDown } from "@tabler/icons-react";
import React, { useState } from "react";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
}

const Select: React.FC<SelectProps> = ({
  label,
  id,
  children,
  className,
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = () => setIsOpen((prev) => !prev);
  const handleChange = () => setIsOpen(false);

  return (
    <div className="relative">
      {label && (
        <label
          htmlFor={id}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
        </label>
      )}
      <div className="relative">
        <select
          id={id}
          onClick={handleClick}
          onChange={handleChange}
          onBlur={handleChange}
          className={`w-full px-3 pr-10 h-12 border border-gray-200 bg-white rounded-2xl focus:outline-none focus:ring-primary focus:border-primary sm:text-sm appearance-none ${className}`}
          {...props}
        >
          {children}
        </select>
        <IconChevronDown
          className={`absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none transition-transform duration-200 ${
            isOpen ? "rotate-180" : "rotate-0"
          }`}
          size={18}
        />
      </div>
    </div>
  );
};

export default Select;
