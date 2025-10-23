import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

const Input: React.FC<InputProps> = ({ label, id, className, ...props }) => {
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
      <input
        id={id}
        className={`w-full px-3 h-12 border  bg-white border-gray-200 rounded-xl focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm ${className}`}
        {...props}
      />
    </div>
  );
};

export default Input;
