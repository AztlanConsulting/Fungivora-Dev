import React from "react";

const InputField = ({ label, type = "text", value, onChange, placeholder }) => {
  return (
    <div className="w-full mb-6 md:mb-8">
      <label className="text-white text-xl md:text-2xl font-bold text-[clamp(0.8rem,2.5vw,1.1rem)]">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="input-field text-[clamp(0.8rem,2.5vw,1rem)]"
      />
    </div>
  );
};

export default InputField;