import { OcupationalGroupI } from "../../../../../../../helpers/intranet/intranet.interface"
import { CompetencyI } from "../../competencias/interfaces/competencias.interfaces"
import { GradesGetI } from "../../grados/interfaces/grados.interfaces"

export interface AsignationCompetencyI {
    idAsignacion: number
    idGrupo: number
    idCompetencia: number
    idGrado: number
}

export interface AsignationGetCompetencyI {
    competenciaObj: CompetencyI
    gradoObj: GradesGetI
    grupoOcupacionlObj: OcupationalGroupI
    idAsignacion: number
    idCompetencia: number  
    idGrado: number
    idGrupo: number
}

