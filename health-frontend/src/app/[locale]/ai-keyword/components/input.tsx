import React, { ChangeEvent } from "react";

interface InputProps {
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  id?: string;
}

export const Input: React.FC<InputProps> = ({
  type = "text",
  placeholder = "",
  value = "",
  onChange = () => {},
  className = "",
  id = "",
}) => {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      id={id}
      onChange={onChange}
      className={`p-2 border rounded ${className}`}
    />
  );
};
