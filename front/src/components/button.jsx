import React from "react";

const Button = ({ type, onClick, children, className }) => (
  <button
    type={type}
    onClick={onClick}
    className={`px-4 py-2 rounded-md ${className}`}
  >
    {children}
  </button>
);

export default Button;
