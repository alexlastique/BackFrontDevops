import React from "react";

const InputField = ({ label, type, name, value, onChange }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
    />
  </div>
);

export default InputField;
