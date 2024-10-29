import { CollaboratorsGetI } from "../../colaboradores/interfaces/colaboradores.interface"

export interface CourseI {
    idCurso: number,
    nombre: string,
    suplidor: string,
    rnc: string,
    cuposDisponibles: number,
    fechaInicio: Date,
    fechaFin: Date,
    fechaInicioInscripcion: Date,
    fechaFinInscripcion: Date,
    descripcion: string,
    interno: boolean,
    idModalidad: number,
    costoPersona: number,
    costoTotal: number,
    link: string,
    idEstado: number
}

export interface CourseGetI {
    idCurso: 1,
    nombre: string,
    suplidor: string,
    rnc: string,
    cuposDisponibles: number,
    fechaInicio: Date,
    fechaFin: Date,
    fechaInicioInscripcion: Date,
    fechaFinInscripcion: Date,
    descripcion: string,
    interno: true,
    idModalidad: 1,
    modalidadObj: ModalityI
    costoPersona: number,
    costoTotal: number,
    link: string,
    trimestre: number,
    idEstado: number,
    estadoCursoObj: StateI
    inscripcionesObj: InscriptionI[]
}

export interface InscriptionI {
    idInscripcion: number,
    idColaborador: number,
    objetivoPrincipal: string,
    resultadoEsperado: string,
    experienciaPrevia: string,
    estadoObj: StateI,
    colaboradorObj: CollaboratorsGetI;
}

export interface StateI {
    idEstado: number,
    nombre: string
}

export interface ModalityI{
    idModalidad: number,
    nombre: string
}
