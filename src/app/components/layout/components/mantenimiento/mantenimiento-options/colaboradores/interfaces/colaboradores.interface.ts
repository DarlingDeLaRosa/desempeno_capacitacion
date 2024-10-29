import { OcupationalGroupI } from "../../../../../../../helpers/intranet/intranet.interface"
import { CourseGetI, StateI } from "../../cursos/interfaces/cursos.interface"

export interface CollaboratorsI {
    nombre: string,
    apellidos: string,
    usuario: string,
    idCargo: number,
    idGrupo: number,
    idDepartamento: number,
    idDireccion: number,
    idViceRectoria: number,
    idDivision: number,
    idRecinto: number,
    idCargoDesempenia: number,
    idGrupoDesempenia: number
}

export interface CollaboratorsGetI {
    idPersona: number,
    nombre: string,
    apellidos: string,
    usuario: string,
    idCargo: number,
    idDepartamento: number,
    idDireccion: number,
    idViceRectoria: number,
    idDivision: number,
    idRecinto: number,
    fechaCreacion: Date,
    fechaActualizacion: Date,
    estado: boolean,
    cedula: string,
    idGrupo: number,
    fechaIngreso: Date,
    sexo: string,
    edad: number,
    supervisor: boolean,
    idEstado: number,
    idCargoDesempenia: number,
    cargoDesempeniaObj: PositionI
    idGrupoDesempenia: number,
    grupoDesempeniaObj: OcupationalGroupI
    cargo: PositionI
    grupoObj: OcupationalGroupI
    estadoObj: StateI
    departamento: DepartmentI
    division: DivisionI,
    direccion: DirectionI
    hijos: any
    cursosPendientes: CourseGetI[];
    viceRectoria: viceRectorate,
    recinto: LocationI
}

export interface PositionI {
    idCargo: number,
    nombre: string
}

export interface LocationI {
    idRecinto: number,
    nombre: string,
    siglas: string,
    direccion: string,
    teléfono: string,
    ext: string
}

export interface DivisionI {
    id: number,
    nombre: string,
    departamento: {
        idDepartamento: number,
        nombre: string
    },
    personas: [string]
}

export interface DepartmentI {
    idDepartamento: number,
    nombre: string,
    divisiones: DivisionI[]
}

export interface DirectionI {
    idDireccion: number,
    nombre: string,
    departamentos: DepartmentI
}

export interface viceRectorate {
    idViceRectoria: number,
    nombre: string,
    direcciones: DirectionI
}


