import React from "react";

const SimpleButton = ({ onClick, children }) => (
  <button
    onClick={onClick}
    className="flex items-center space-x-2 border rounded-lg px-4 py-2 text-gray-800 hover:bg-gray-100"
  >
    {children}
  </button>
);

export default SimpleButton;
