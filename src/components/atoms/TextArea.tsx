import React from "react";

interface TextAreaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
}

const TextArea: React.FC<TextAreaProps> = ({
  label,
  id,
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
      <textarea
        id={id}
        className={`w-full px-3 py-2 h-32 border  bg-white border-gray-200 rounded-xl focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm ${className}`}
        {...props}
      />
    </div>
  );
};

export default TextArea;
