import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import Resumen from "../../../shared/crear-inoculos/components/Resumen";

vi.mock("../../../shared/components/ui/basics/Texto", () => ({
  default: ({ children }) => <span>{children}</span>,
}));

const composicionMock = [
  { nombre: "Agua", unidad: "ml", value: "100" },
  { nombre: "Peptona", unidad: "g", value: "5" },
];

describe("Resumen — renderizado base", () => {
  it('muestra el título "Resumen"', () => {
    render(<Resumen />);
    expect(screen.getByText("Resumen")).toBeInTheDocument();
  });

  it("muestra las etiquetas Código, Especie, Inóculo y Composición", () => {
    render(<Resumen />);
    expect(screen.getByText("Código")).toBeInTheDocument();
    expect(screen.getByText("Especie")).toBeInTheDocument();
    expect(screen.getByText("Inóculo")).toBeInTheDocument();
  });

  it('muestra "—" en código, especie e inóculo cuando no se pasan props', () => {
    render(<Resumen />);
    expect(screen.getAllByText("—")).toHaveLength(3);
  });
});

describe("Resumen — códigos", () => {
  it('muestra label singular "Código" y el código único cuando codigos tiene 1 elemento', () => {
    render(<Resumen codigos={["ML-PD-120226"]} />);
    expect(screen.getByText("Código")).toBeInTheDocument();
    expect(screen.getByText("ML-PD-120226")).toBeInTheDocument();
  });

  it('muestra label plural "Códigos" y la lista numerada cuando hay más de 1 código', () => {
    const codigos = ["ML-PD-120226-1", "ML-PD-120226-2", "ML-PD-120226-3"];
    render(<Resumen codigos={codigos} />);

    expect(screen.getByText("Códigos")).toBeInTheDocument();
    codigos.forEach((c) => expect(screen.getByText(c)).toBeInTheDocument());

    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
  });

  it('muestra "—" en la sección de código cuando codigos está vacío', () => {
    render(<Resumen codigos={[]} />);
    expect(screen.getAllByText("—").length).toBeGreaterThanOrEqual(1);
  });
});

describe("Resumen — composición", () => {
  it("renderiza el nombre de cada item con dos puntos", () => {
    render(<Resumen composicion={composicionMock} />);
    expect(screen.getByText("Agua:")).toBeInTheDocument();
    expect(screen.getByText("Peptona:")).toBeInTheDocument();
  });

  it("muestra el valor con su unidad cuando cantidad = 1", () => {
    render(<Resumen composicion={composicionMock} cantidad={1} />);
    expect(screen.getByText("100 ml")).toBeInTheDocument();
    expect(screen.getByText("5 g")).toBeInTheDocument();
  });

  it("multiplica el valor por la cantidad cuando cantidad > 1", () => {
    render(<Resumen composicion={composicionMock} cantidad={3} />);
    expect(screen.getByText("300 ml")).toBeInTheDocument();
    expect(screen.getByText("15 g")).toBeInTheDocument();
  });

  it('muestra el desglose "valor × cantidad" cuando cantidad > 1', () => {
    render(<Resumen composicion={composicionMock} cantidad={3} />);
    expect(screen.getByText("100 × 3")).toBeInTheDocument();
    expect(screen.getByText("5 × 3")).toBeInTheDocument();
  });

  it("no muestra el desglose cuando cantidad = 1", () => {
    render(<Resumen composicion={composicionMock} cantidad={1} />);
    expect(screen.queryByText("100 × 1")).not.toBeInTheDocument();
    expect(screen.queryByText("5 × 1")).not.toBeInTheDocument();
  });

  it('soporta valores con coma decimal (ej. "1,5")', () => {
    const composicion = [{ nombre: "Coma", unidad: "ml", value: "1,5" }];
    render(<Resumen composicion={composicion} cantidad={2} />);
    expect(screen.getByText("3 ml")).toBeInTheDocument();
  });

  it('muestra "0" cuando el valor del item está vacío', () => {
    const composicion = [{ nombre: "Vacío", unidad: "ml", value: "" }];
    render(<Resumen composicion={composicion} cantidad={1} />);
    expect(screen.getByText("0 ml")).toBeInTheDocument();
  });

  it("redondea el total a 2 decimales", () => {
    const composicion = [{ nombre: "Decimal", unidad: "ml", value: "1.333" }];
    render(<Resumen composicion={composicion} cantidad={3} />);
    // 1.333 * 3 = 3.999 → 4
    expect(screen.getByText("4 ml")).toBeInTheDocument();
  });
});
