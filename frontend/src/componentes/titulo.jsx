import React from "react";
import Text from "./texto";

const Titulo = ({ children }) => {
  return (
    <div
    className="
        w-screen  
        absolute top-0 left-0 
        bg-[#3b3fb6]
        shadow-[0_10px_25px_rgba(0,0,0,0.4)]
        flex items-left
        h-auto 
        px-8 py-8        
        md:px-12 md:py-6  
    "
    >
      <div className="w-full">
        <Text variante="title">
          {children}
        </Text>
      </div>
    </div>
  );
};

export default Titulo;