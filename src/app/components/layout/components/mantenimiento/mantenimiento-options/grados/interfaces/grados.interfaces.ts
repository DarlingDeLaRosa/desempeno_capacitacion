import { CompetencyI } from "../../competencias/interfaces/competencias.interfaces"

export interface GradesI {
    idGrado: number,
    idCompetencia: number,
    nombre: string,
    descripcion: string
    comportamientos: comportamientos[]
}

export interface comportamientos {
    nombre: string,
    probatorio: boolean,
    calificacion: number
}

export interface GradesGetI {
    competenciaObj: CompetencyI
    comportamientosObj: comportamientos[]
    descripcion: string
    idCompetencia: number
    idGrado: number
    nombre: string
}

