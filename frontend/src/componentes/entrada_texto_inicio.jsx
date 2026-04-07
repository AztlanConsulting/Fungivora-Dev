import React from "react";

const InputField = ({ label, type = "text", value, onChange, placeholder }) => {
  return (
    <div className="w-full mb-6 md:mb-8">
      <label className="text-white text-xl md:text-2xl font-bold flex items-center gap-2 ml-2">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="input-field"
      />
    </div>
  );
};

export default InputField;