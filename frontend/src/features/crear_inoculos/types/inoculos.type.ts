export type InoculoUsado = {
  id: number;
  cantidad: number;
};

export type Ingrediente = {
  id: string;
  cantidad: number;
};

export type RegistroSemilla = {
  codigo_fungivora: string;
  tipo: string;
  especie: string;
  fecha: string;
  cantidad_disponible: number;
  unidad: string;
  stock_recomendado: number;
  nota: string;
  inoculo_usado: InoculoUsado;
  ingredientes: Ingrediente[];
};