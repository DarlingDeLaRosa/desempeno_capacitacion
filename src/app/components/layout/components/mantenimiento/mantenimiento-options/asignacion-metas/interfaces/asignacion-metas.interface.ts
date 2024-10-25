import { OcupationalGroupI } from "../../../../../../../helpers/intranet/intranet.interface"
import { GoalGetI } from "../../metas/interface/metas.interface"

export interface AsignationGoalI {
    idAsignacion: number,
    idGrupo: number,
    idMeta: number
}

export interface AsignationGoalGetI {
    idAsignacion: number,
    idGrupo: number,
    grupoOcupacionalObj: OcupationalGroupI
    idMeta: number,
    metaObj: GoalGetI
}