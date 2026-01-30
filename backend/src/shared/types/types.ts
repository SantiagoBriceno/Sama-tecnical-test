// definiciones de tipos compartidos en la aplicación
export interface AuthPayload {
  sub: string;
  username: string;
}

export enum UnitType {
  GR = 'gr',
  ML = 'ml',
  TAZA = 'taza',
  UNIDAD = 'unidad',
  KG = 'kg'
}