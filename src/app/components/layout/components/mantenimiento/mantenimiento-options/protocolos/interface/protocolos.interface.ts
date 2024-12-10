export interface ProtocolI {
    idProtocolo: number
    nombre: string
    idTipoProtocolo: number
    tipoProtocoloObj: TypeProtocolI
    documentosObj: DocumentI[]
}

export interface DocumentI {
    idDocumento: number
    nombre: string
    enlace: string
    idAcuerdo: number
    idAcuerdoDetalle: number
    idMeta: number
    idProtocolo: number
    idMinuta: number
    fecha: Date
}

export interface TypeProtocolI {
    idTipoProtocolo: number,
    nombre: string
}