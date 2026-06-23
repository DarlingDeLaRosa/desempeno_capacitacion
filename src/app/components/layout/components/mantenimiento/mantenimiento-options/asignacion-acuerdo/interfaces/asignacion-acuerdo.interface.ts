import { UserResumeI, UserResumeTypeTwoI } from "../../../../../../../helpers/intranet/intranet.interface";
import { CollaboratorsGetI } from "../../colaboradores/interfaces/colaboradores.interface";
import { PeriodI } from "../../periodos/interfaces/periodo.interface";

export interface asignationAgreementGetI {
    idAsignacion: number,
    colaborador: CollaboratorsGetI
    periodo: PeriodI
    supervisor: UserResumeTypeTwoI
    tipoAcuerdoObj: typeAgreementI
    acuerdoDuracion: durationAgreementI
}

export interface asignationAgreementI {
    idAsignacion: number
    idTipoAcuerdo: number
    periodoId: number
    idColaborador: number
    acuerdosDuracionId: number
}

export interface durationAgreementI {
    id: number
    duracion: string
}

export interface typeProcessesI {
    id: number
    nombre: string
}

export interface typeAgreementI {
    idTipoAcuerdo: number,
    nombre: string,
    puntuacion: number
}

export interface durationAgreementI {
    id: number,
    duracion: string
}
