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

export interface UserResumeTypeTwoI {
  idPersona: number,
  nombres: string,
  apellidos: string,
  usuario: string,
  cedula: string,
  unidadOrganizativa: string,
  supervisorInterino: boolean
}

export interface UserResumeI {
  idPersona: number,
  nombre: string,
  apellidos: string,
  usuario: string,
  cedula: string,
  unidadOrganizativa: string,
  supervisorInterino: boolean
}

export interface loggedUserI {
  Firstname: string;
  Id: string;
  idPersona: number;
  SupervisorInterino: string
  IdRecinto: string;
  Lastname: string;
  Position: string;
  idSupliendoA: string;
  RecintoSigla: string;
  IdDepartamento: string;
  Unidad: string;
  Username: string;
  Supervisor: string;
  aud: string;
  exp: number;
  idSistema: string;
  iss: string;
  jti: string;
  role: string;
  sub: string;
}

export interface GeneralI {
  id: number,
  nombre: string
}
