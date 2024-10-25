export interface OcupationalGroupI {
    idGrupo: number
    nombre: string
}

export interface SuppliersI {
    rnc: string
    razonSocial: string
    nombreComercial: string
    estado: string
}

export interface loggedUserI{
  Firstname: string;
  Id: string;
  idPersona: number;
  IdRecinto: string;
  Lastname: string;
  Position: string;
  RecintoSigla: string;
  Unidad: string;
  Username: string;
  aud: string;
  exp: number;
  idSistema: string;
  iss: string;
  jti: string;
  role: string;
  sub: string;
}
