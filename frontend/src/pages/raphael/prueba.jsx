import React, { useEffect, useRef } from 'react';
import Raphael from 'raphael';

const DiagramaRaphael = ({ datos, onNodoClick }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current || !datos || !datos.nodos) return;

    const paper = Raphael(containerRef.current, "100%", 500);
    const col = {
      abuelo: { f: "#fef3c7", s: "#d97706" },
      padre: { f: "#dcfce7", s: "#16a34a" },
      hijo: { f: "#e0e7ff", s: "#4f46e5" },
      linea: "#e2e8f0"
    };

    // Dibujar Conexiones
    datos.conexiones.forEach(conn => {
      const o = datos.nodos.find(n => n.id === conn.from);
      const d = datos.nodos.find(n => n.id === conn.to);
      if (o && d) {
        const path = `M${o.x},${o.y-25} L${d.x},${d.y+25}`;
        paper.path(path).attr({ stroke: col.linea, "stroke-width": 2 }).toBack();
      }
    });

    // Dibujar Nodos
    datos.nodos.forEach(nodo => {
      const estilo = col[nodo.tipo] || col.hijo;
      
      const rect = paper.rect(nodo.x - 70, nodo.y - 25, 140, 50, 15).attr({
        fill: estilo.f,
        stroke: estilo.s,
        "stroke-width": 2,
        cursor: "pointer"
      });

      paper.text(nodo.x, nodo.y, nodo.label).attr({
        "font-family": "Inter",
        "font-size": 11,
        "font-weight": "600",
        fill: "#1e293b",
        cursor: "pointer"
      }).click(() => onNodoClick(nodo.id));

      rect.click(() => onNodoClick(nodo.id));
      
      // Animación simple
      rect.mouseover(() => rect.animate({ "stroke-width": 4 }, 200));
      rect.mouseout(() => rect.animate({ "stroke-width": 2 }, 200));
    });

    return () => paper.remove();
  }, [datos, onNodoClick]);

  return <div ref={containerRef} className="w-full min-h-[500px]" />;
};

export default DiagramaRaphael;