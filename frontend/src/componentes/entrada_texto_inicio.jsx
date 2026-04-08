import React from "react";

const InputField = ({ label, type = "text", value, onChange, placeholder, icon }) => {
  return (
    <div className="w-full mb-6 md:mb-8">

      <div className="flex items-center gap-2 text-white mb-1">
        {icon && <span className="flex items-center">{icon}</span>}
        <label className="font-bold text-[clamp(1rem,3vw,1.4rem)]">
          {label}
        </label>
      </div>

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