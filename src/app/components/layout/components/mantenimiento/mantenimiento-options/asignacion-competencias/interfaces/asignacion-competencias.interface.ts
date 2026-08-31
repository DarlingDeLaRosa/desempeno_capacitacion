import { OcupationalGroupI } from "../../../../../../../helpers/intranet/intranet.interface"
import { EvaluationCompetencyTestI } from "../../../../evaluacion-competencias/interface/evaluacion-competencias.interface"
import { PositionI } from "../../colaboradores/interfaces/colaboradores.interface"
import { CompetencyI } from "../../competencias/interfaces/competencias.interfaces"
import { GradesGetI } from "../../grados/interfaces/grados.interfaces"

export interface AsignationCompetencyI {
    idAsignacion: number
    idGrupo: number
    cargoId: number
    idCompetencia: number
    idGrado: number
}

export interface AsignationGetCompetencyI {
    competenciaObj: CompetencyI
    cargo: PositionI
    gradoObj: GradesGetI
    grupoOcupacionlObj: OcupationalGroupI
    idAsignacion: number
    idCompetencia: number
    idGrado: number
    idGrupo: number
}

export interface AsignationGetCompetencyPositionI {
    cargo: PositionI | null
    competenciaObj: { id: number, nombre: string, descripcion: string }
    gradoObj: EvaluationCompetencyTestI,
    grupoOcupacionlObj: OcupationalGroupI | null 
    idAsignacion: number
}
