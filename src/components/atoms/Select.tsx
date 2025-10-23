import React from "react";

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
  return (
    <div>
      {label && (
        <label
          htmlFor={id}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
        </label>
      )}
      <select
        id={id}
        className={`w-full  px-3 h-12 border border-gray-200 bg-white rounded-xl focus:outline-none focus:ring-teal-500 focus:border-gray-500 sm:text-sm ${className}`}
        {...props}
      >
        {children}
      </select>
    </div>
  );
};

export default Select;
