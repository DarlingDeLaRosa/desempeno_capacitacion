import { CompetencyI } from "../../competencias/interfaces/competencias.interfaces"
import { GradesTypeGetI } from "./tiposGrados.interface"

export interface GradesI {
    idGrado: number,
    idCompetencia: number,
    nombre: string,
    descripcion: string
    idTipoGrado: number
    comportamientos: behaviorsI[]
}

export interface behaviorsI {
    idComportamiento: number
    nombre: string,
    probatorio: boolean,
}

export interface GradesGetI {
    competenciaObj: CompetencyI
    comportamientosObj: behaviorsI[]
    descripcion: string
    idCompetencia: number
    idGrado: number
    nombre: string
    idTipoGrado: number
    tipoGradoObj: GradesTypeGetI
}

