import React, { useEffect, useRef } from 'react';
import Raphael from 'raphael';

const DiagramaRaphael = ({ datos }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    // Validación de seguridad para 'datos' y el contenedor
    if (!containerRef.current || !datos || !datos.nodos) return;

    const paper = Raphael(containerRef.current, "100%", 400);
    
    const estilos = {
      nodo: { fill: "#fdf2f8", stroke: "#db2777", "stroke-width": 2, r: 8 },
      texto: { "font-family": "Inter, sans-serif", "font-size": 14, fill: "#334155" },
      linea: { stroke: "#fbcfe8", "stroke-width": 2 }
    };

    // Dibujar conexiones
    if (datos.conexiones) {
      datos.conexiones.forEach(conn => {
        const origen = datos.nodos.find(n => n.id === conn.from);
        const destino = datos.nodos.find(n => n.id === conn.to);
        
        if (origen && destino) {
          paper.path(`M${origen.x} ${origen.y}L${destino.x} ${destino.y}`)
               .attr(estilos.linea);
        }
      });
    }

    // Dibujar nodos
    datos.nodos.forEach(nodo => {
      const c = paper.rect(nodo.x - 40, nodo.y - 20, 80, 40, estilos.nodo.r)
                     .attr(estilos.nodo);
      
      paper.text(nodo.x, nodo.y, nodo.label)
           .attr(estilos.texto);

      c.mouseover(() => c.animate({ fill: "#fbcfe8", transform: "s1.1" }, 200));
      c.mouseout(() => c.animate({ fill: "#fdf2f8", transform: "s1" }, 200));
    });

    return () => paper.remove();
  }, [datos]);

  return (
    <div 
      ref={containerRef} 
      className="w-full bg-white rounded-lg shadow-inner overflow-hidden border border-slate-200" 
    />
  );
};

// ESTA ES LA LÍNEA QUE FALTA:
export default DiagramaRaphael;