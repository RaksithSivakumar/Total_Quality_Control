import React from "react";

export default function Input({ placeholder, type = "text", onChange, icon, value }) {
  return (
    <div className="relative w-full">
      {icon && (
        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
          {icon}
        </span>
      )}
      <input
        type={type}
        placeholder={placeholder}
        value={value} // Corrected: Accepts value from props
        className="w-full p-3 pl-10 bg-gray-100 rounded-md border-none outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
        onChange={onChange}
      />
    </div>
  );
}