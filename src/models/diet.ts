export interface Diet {
  [giorno: string]: Pasto[];
}

export interface Pasto {
  pasto: "colazione" | "pranzo" | "cena";
  alimenti: Alimento[];
}

export interface Alimento {
  alimento: string;         // nome dell'alimento
  quantità: string;
  codice_alt: string;
}