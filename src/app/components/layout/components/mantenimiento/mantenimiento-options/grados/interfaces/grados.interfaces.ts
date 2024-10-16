import { CompetencyI } from "../../competencias/interfaces/competencias.interfaces"
import { GradesTypeGetI } from "./tiposGrados.interface"

export interface GradesI {
    idGrado: number,
    idCompetencia: number,
    nombre: string,
    descripcion: string
    idTipoGrado: number
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
    idTipoGrado: number
    tipoGradoObj: GradesTypeGetI
}

