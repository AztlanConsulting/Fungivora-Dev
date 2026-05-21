import React, { useEffect, useRef } from 'react';
import Raphael from 'raphael';

const MiComponenteVisual = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current) {
      const paper = Raphael(containerRef.current, 500, 500);
      
      const circle = paper.circle(250, 250, 100);
      circle.attr({
        fill: "#fbcfe8", 
        stroke: "#db2777",
        "stroke-width": 4
      });

      return () => {
        paper.remove();
      };
    }
  }, []);

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-slate-50">
      <h2 className="text-2xl font-bold text-slate-800 mb-4">Visualización con Raphael</h2>
      <div 
        ref={containerRef} 
        className="border-2 border-dashed border-pink-200 rounded-xl bg-white shadow-lg"
      />
    </div>
  );
};

export default MiComponenteVisual;