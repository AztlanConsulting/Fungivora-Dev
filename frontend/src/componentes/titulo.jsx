import React from "react";

const Titulo = ({ children }) => {
    return (
    <h1 className="text-4xl md:text-6xl font-bold text-[#3b3fb6] mb-8 md:mb-10 text-center md:text-left">
        {children}
    </h1>)};

export default Titulo;