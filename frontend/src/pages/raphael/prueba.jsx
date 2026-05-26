import React, { useEffect, useRef, useState } from 'react';
import Raphael from 'raphael';
import { colores } from '../../shared/components/ui/basics/colores';

const DiagramaRaphael = ({ datos, onNodoClick, anchoCanvas = 700 }) => {
  const containerRef = useRef(null);
  const [esMovil, setEsMovil] = useState(false);

  // Detectar el tamaño de la pantalla para ajustar comportamientos base
  useEffect(() => {
    const verificarTamano = () => {
      setEsMovil(window.innerWidth < 1024);
    };
    verificarTamano();
    window.addEventListener('resize', verificarTamano);
    return () => window.removeEventListener('resize', verificarTamano);
  }, []);

  useEffect(() => {
    if (!containerRef.current || !datos || !datos.nodos) return;

    // Calcular el alto dinámicamente: si es móvil necesita más espacio vertical debido al acomodo de hijos
    const altoDinamico = esMovil ? Math.max(datos.nodos.length * 65, 500) : 450;
    
    // Inicializar el lienzo con las dimensiones elásticas calculadas
    const paper = Raphael(containerRef.current, anchoCanvas, altoDinamico);
    
    const configEstilos = {
      abuelo: { 
        bg: colores.grisClaro, 
        stroke: colores.grisMedio, 
        text: colores.gris,
        font: "'Inter', sans-serif"
      },
      padre: { 
        bg: "#EAF7F2", 
        stroke: colores.verdeOscuro, 
        text: colores.verdeMuyOscuro,
        font: "'Inter', sans-serif"
      },
      hijo: { 
        bg: colores.azul, 
        stroke: colores.azulOscuro, 
        text: colores.blanco,
        font: "'ADLaM Display', cursive" 
      },
      linea: colores.grisMedio
    };

    // 1. RENDERIZADO DE CONEXIONES CON CURVAS SUAVES
    datos.conexiones.forEach(conn => {
      const o = datos.nodos.find(n => n.id === conn.from);
      const d = datos.nodos.find(n => n.id === conn.to);
      if (o && d) {
        let pathStr;
        if (esMovil) {
          // En móvil las conexiones son curvas de flujo lateral-vertical más legibles
          pathStr = `M${o.x},${o.y} C${o.x},${(o.y + d.y)/2} ${d.x},${(o.y + d.y)/2} ${d.x},${d.y}`;
        } else {
          // En compu es una línea directa estilizada desde las bases
          pathStr = `M${o.x},${o.y - 24} L${d.x},${d.y + 24}`;
        }
        
        paper.path(pathStr).attr({ 
          stroke: configEstilos.linea, 
          "stroke-width": 2,
          "stroke-linecap": "round"
        }).toBack();
      }
    });

    // 2. RENDERIZADO DE NODOS
    datos.nodos.forEach(nodo => {
      const estilo = configEstilos[nodo.tipo] || configEstilos.hijo;
      const anchoCard = esMovil ? 140 : 150;
      const altoCard = 46;
      const radioEsquinas = 10;

      const rect = paper.rect(nodo.x - (anchoCard / 2), nodo.y - (altoCard / 2), anchoCard, altoCard, radioEsquinas).attr({
        fill: estilo.bg,
        stroke: estilo.stroke,
        "stroke-width": 1.5,
        cursor: "pointer"
      });

      const texto = paper.text(nodo.x, nodo.y, nodo.label).attr({
        "font-family": estilo.font,
        "font-size": esMovil ? "11px" : "12px",
        "font-weight": "600",
        fill: estilo.text,
        cursor: "pointer"
      });

      const manejarClick = () => onNodoClick(nodo.id);
      rect.click(manejarClick);
      texto.click(manejarClick);
      
      const enHover = () => {
        rect.animate({ "stroke-width": 2.5, "transform": "s1.02" }, 120, "ease-out");
      };
      const fueraHover = () => {
        rect.animate({ "stroke-width": 1.5, "transform": "s1.0" }, 120, "ease-in");
      };

      rect.mouseover(enHover);
      texto.mouseover(enHover);
      rect.mouseout(fueraHover);
      texto.mouseout(fueraHover);
    });

    return () => paper.remove();
  }, [datos, onNodoClick, anchoCanvas, esMovil]);

  return (
    <div 
      ref={containerRef} 
      style={{ width: anchoCanvas }}
      className="mx-auto transition-all duration-300" 
    />
  );
};

export default DiagramaRaphael;