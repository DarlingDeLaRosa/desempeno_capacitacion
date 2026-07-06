export interface ChangeItem {
  campo: string;
  anterior: any;
  nuevo: any;
}

export interface HistorialUI {
  fecha: string;
  accion: string;
  mensaje?: string;
  cambios: ChangeItem[];
}