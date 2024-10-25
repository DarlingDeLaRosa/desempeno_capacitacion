export interface GoalI {
    idMeta: number,
    idMedio: number,
    nombre: string,
    valor: number
}

export interface GoalGetI {
    idMeta: number,
    idMedio: number,
    medioVerificacionObj: VerificationMethodI
    nombre: string,
    valor: number
}

export interface VerificationMethodI {
    idMedio: number,
    nombre: string
}