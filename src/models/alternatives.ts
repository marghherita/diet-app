export interface AlternativeMap {
  [codice_alt: string]: AlternativeItem[];
}

export interface AlternativeItem {
  alimento: string;
  quantità: string;
}
