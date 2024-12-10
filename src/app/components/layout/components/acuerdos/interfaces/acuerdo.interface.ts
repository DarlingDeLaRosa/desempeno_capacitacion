import { PeriodoI } from '../../../../interfaces/generalInteerfaces';
import { CollaboratorsGetI } from '../../mantenimiento/mantenimiento-options/colaboradores/interfaces/colaboradores.interface';

export interface AcuerdoI{
  idAcuerdo: number,
  idColaborador: number,
  colaboradorObj: CollaboratorsGetI
  idTipoAcuerdo:number,
  tipoAcuerdoObj: TipoAcuerdoI,
  idTracking:TrackingI,
  idFlujo: number,
  flujoObj: any,
  puntos:number
  comentario:string
  detalles: AcuerdoDetalle[];
  documentosObj: Documento[];
  periodo: PeriodoI
}

export interface TipoAcuerdoI{
  idTipoAcuerdo: number,
   nombre: string
}
export interface TrackingI{
  idTraking: number,
  nombre: string,
}

export interface AcuerdoDetalle {
  idAcuerdoDetalle: number;
  idAcuerdo: number;
  idMeta: number;
  metaObj: Meta;
  calificacion: number;
  documentosObj:Documento
}



export interface Meta {
  idMeta: number;
  idMedio: number;
  medioVerificacionObj: any;
  nombre: string;
  valor: number;
  isTranversal:boolean;
  metaPoa: any;
}

export interface Documento {
  idDocumento: number;
  nombre: string;
  enlace: string;
  idAcuerdo: number;
  idAcuerdoDetalle: number ;
  idMeta: number ;
  idProtocolo: number;
  idMinuta: number;
  fecha: string;
}
