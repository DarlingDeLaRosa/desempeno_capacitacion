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

export interface PersonI {
    rol: RolI
    usuario: string
    idPersona: number
    idSistema: number
    idUsuario: number
    persona: CollaboratorsGetI
}

export interface CollaboratorSummaryGetI {
    apellidos: string
    cedula: string
    id: number
    nombres: string
    personaIntranetId: number
    usuario: string
}

export interface CollaboratorsGetI {
    idPersona: number,
    nombre: string,
    apellidos: string,
    usuario: string,
    estado: boolean,
    cedula: string,
    fechaIngreso: Date,
    fechaNacimiento: Date,
    sexo: string,
    edad: number,
    supervisor: boolean,
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
    idSupervisor: number
    hijos: any
    idEstado: number
    cursosPendientes: CourseGetI[];
    viceRectoria: ViceRectorate,
    recinto: LocationI
    carreraAdministrativa: boolean
    supervisorObj: SupervisorI
    unidad: string | undefined
}

export interface PositionI {
    idCargo: number,
    nombre: string
}


export interface SupervisorI {
    nombre: string,
    apellidos: string,
    cargoObj: PositionI
}

export interface RolI {
    idRol: number
    idSistema: number
    modulos: any
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

export interface ViceRectorate {
    idViceRectoria: number,
    nombre: string,
    direcciones: DirectionI
}

export interface PersonSystemI {
    apellidos: string
    departamento: DepartmentI
    direccion: DirectionI
    division: DivisionI
    fechaUltimaSesion: string
    idPersona: number
    idUsuario: number
    nombre: string
    rol: RolI
    unidad: string
    username: string
    viceRectoria: ViceRectorate
}
