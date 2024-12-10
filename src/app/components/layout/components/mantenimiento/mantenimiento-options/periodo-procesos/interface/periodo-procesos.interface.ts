import { PeriodI } from "../../periodos/interfaces/periodo.interface"

export interface periodProcessI {
    idPeriodoAcuerdo: number,
    fechaInicio: Date,
    fechaFin: Date,
    fechaProroga: Date,
    tipoProcesoId: number,
    periodoId: number
}

export interface periodProcessGetI {
    idPeriodoAcuerdo: number,
    fechaInicio: Date,
    fechaFin: Date,
    fechaProroga: Date,
    tipoProceso: processTypeI
    periodo: PeriodI
}

export interface processTypeI {
    id: number,
    nombre: string
}