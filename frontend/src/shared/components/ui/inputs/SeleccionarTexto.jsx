import React, { useState, useRef, useEffect, useCallback } from "react";
import { colores } from "../basics/Colores";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowDown01Icon } from "@hugeicons/core-free-icons";

const SelectField = ({
  value,
  onChange,
  placeholder,
  options = [],
  size = "normal",
  loading = false,
  error = null,
  label = null,
  disabled = false,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState("bottom");
  const containerRef = useRef(null);
  const dropdownRef = useRef(null);

  const sizes = {
    forms: "w-80 md:w-[24rem]",
    normal: "w-80 md:w-96",
    amplio: "w-80 md:w-96",
    numero: "w-28 md:w-36",
  };

  const sizeClass = sizes[size] || sizes.normal;
  const textColor = colores.gris;

  const placeholderText = loading
    ? "Cargando..."
    : error
      ? error
      : placeholder;

  const isDisabled = disabled || loading;

  const selectedOption = options.find((op) => op.value === value);
  const displayText = selectedOption ? selectedOption.label : placeholderText;
  const hasValue = !!selectedOption;

  // Calcular si el dropdown debe abrirse hacia arriba o hacia abajo
  const calculatePosition = useCallback(() => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;
    const dropdownHeight = Math.min(options.length * 44, 220);

    if (spaceBelow < dropdownHeight && spaceAbove > spaceBelow) {
      setDropdownPosition("top");
    } else {
      setDropdownPosition("bottom");
    }
  }, [options.length]);

  const handleToggle = () => {
    if (isDisabled) return;
    if (!isOpen) {
      calculatePosition();
    }
    setIsOpen((prev) => !prev);
    setIsFocused(true);
  };

  const handleSelect = (optionValue) => {
    // Simular evento compatible con el onChange original
    const syntheticEvent = {
      target: { value: optionValue },
    };
    onChange(syntheticEvent);
    setIsOpen(false);
    setIsFocused(false);
  };

  const handleKeyDown = (e) => {
    if (isDisabled) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleToggle();
    }
    if (e.key === "Escape") {
      setIsOpen(false);
      setIsFocused(false);
    }
    if (e.key === "ArrowDown" && isOpen) {
      e.preventDefault();
      const currentIndex = options.findIndex((op) => op.value === value);
      const nextIndex = Math.min(currentIndex + 1, options.length - 1);
      handleSelect(options[nextIndex].value);
    }
    if (e.key === "ArrowUp" && isOpen) {
      e.preventDefault();
      const currentIndex = options.findIndex((op) => op.value === value);
      const prevIndex = Math.max(currentIndex - 1, 0);
      handleSelect(options[prevIndex].value);
    }
  };

  // Cerrar al hacer click fuera
  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target)
      ) {
        setIsOpen(false);
        setIsFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [isOpen]);

  // Recalcular posición al hacer scroll o resize
  useEffect(() => {
    if (!isOpen) return;
    const handleReposition = () => calculatePosition();
    window.addEventListener("scroll", handleReposition, true);
    window.addEventListener("resize", handleReposition);
    return () => {
      window.removeEventListener("scroll", handleReposition, true);
      window.removeEventListener("resize", handleReposition);
    };
  }, [isOpen, calculatePosition]);

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <span style={{
          fontSize: "28px",
          color: colores.negro,
          fontWeight: "500",
          fontStyle: "italic",
        }}>
          {label}
        </span>
      )}

      <div className={`relative ${sizeClass}`} ref={containerRef}>
        {/* Botón principal del select */}
        <div
          role="combobox"
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-disabled={isDisabled}
          tabIndex={isDisabled ? -1 : 0}
          onClick={handleToggle}
          onKeyDown={handleKeyDown}
          onBlur={(e) => {
            // Solo cerrar si el foco sale completamente del componente
            if (!containerRef.current?.contains(e.relatedTarget)) {
              setIsOpen(false);
              setIsFocused(false);
            }
          }}
          className={`
            w-full relative overflow-hidden rounded-xl transition-all
            flex items-center px-3 py-2 pr-10
            cursor-pointer select-none
            ${isDisabled ? "opacity-50 cursor-not-allowed" : ""}
        `}
          style={{
            backgroundColor: "#FFFFFF",
            boxShadow: `0 0 0 ${isFocused ? '4px' : '2px'} ${isFocused ? colores.azul : colores.grisClaro}`,
            minHeight: '42px',
          }}
        >
          <span
            className="text-base flex-1 truncate"
            style={{
              color: hasValue ? textColor : colores.grisMedio,
              fontStyle: "italic",
            }}
          >
            {displayText}
          </span>

          {/* Icono flecha con rotación animada */}
          <span
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 transition-transform duration-200"
            style={{
              color: colores.grisMedio,
              transform: `translateY(-50%) rotate(${isOpen ? "180deg" : "0deg"})`,
            }}
          >
            <HugeiconsIcon icon={ArrowDown01Icon} size={20} />
          </span>
        </div>

        {/* Dropdown custom — anclado al contenedor, no al viewport */}
        {isOpen && (
          <ul
            ref={dropdownRef}
            role="listbox"
            className="absolute left-0 right-0 z-50 rounded-xl overflow-y-auto"
            style={{
              backgroundColor: "#FFFFFF",
              boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
              border: `2px solid ${colores.grisClaro}`,
              maxHeight: "220px",
              // Posición dinámica: arriba o abajo
              ...(dropdownPosition === "bottom"
                ? { top: "calc(100% + 6px)", bottom: "auto" }
                : { bottom: "calc(100% + 6px)", top: "auto" }),
            }}
          >
            {options.length === 0 ? (
              <li
                className="px-3 py-2 text-base"
                style={{ color: colores.grisClaro, fontStyle: "italic" }}
              >
                Sin opciones
              </li>
            ) : (
              options.map((op, index) => {
                const isSelected = op.value === value;
                return (
                  <li
                    key={`${op.value}-${index}`}
                    role="option"
                    aria-selected={isSelected}
                    onMouseDown={(e) => {
                      // mousedown antes de blur para no perder el click en iOS
                      e.preventDefault();
                      handleSelect(op.value);
                    }}
                    className="px-3 py-2 text-base cursor-pointer transition-colors"
                    style={{
                      color: isSelected ? colores.azul : textColor,
                      fontStyle: "italic",
                      fontWeight: isSelected ? "600" : "400",
                      backgroundColor: isSelected
                        ? `${colores.azul}10`
                        : "transparent",
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected)
                        e.currentTarget.style.backgroundColor = `${colores.grisClaro}30`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = isSelected
                        ? `${colores.azul}10`
                        : "transparent";
                    }}
                  >
                    {op.label}
                  </li>
                );
              })
            )}
          </ul>
        )}
      </div>
    </div>
  );
};

export default SelectField;