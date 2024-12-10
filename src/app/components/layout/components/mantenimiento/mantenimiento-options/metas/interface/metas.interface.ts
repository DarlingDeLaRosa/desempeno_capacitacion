export interface GoalI {
    idMeta: number
    idMedio: number
    metaPoa: number
    nombre: string
    valor: number
    isTranversal: boolean
}

export interface GoalGetI {
    idMeta: number,
    idMedio: number,
    medioVerificacionObj: VerificationMethodI
    nombre: string,
    valor: number
    metaPoa: string | null
    isTranversal: boolean
}

export interface VerificationMethodI {
    idMedio: number,
    nombre: string
}