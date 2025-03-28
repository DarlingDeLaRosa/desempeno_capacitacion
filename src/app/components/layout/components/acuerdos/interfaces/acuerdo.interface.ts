import { GeneralI } from '../../../../../helpers/intranet/intranet.interface';
import { PeriodoI } from '../../../../interfaces/generalInteerfaces';
import { CollaboratorsGetI } from '../../mantenimiento/mantenimiento-options/colaboradores/interfaces/colaboradores.interface';
import { periodProcessGetI, periodProcessI } from '../../mantenimiento/mantenimiento-options/periodo-procesos/interface/periodo-procesos.interface';

export interface AcuerdoI {
  idAcuerdo: number,
  idColaborador: number,
  colaboradorObj: CollaboratorsGetI
  idTipoAcuerdo: number,
  tipoAcuerdoObj: TipoAcuerdoI,
  idTracking: TrackingI,
  idFlujo: number,
  flujoObj: { idFlujo:number, nombre: string },
  puntos: number
  comentarios: commentsI[]
  detalles: AcuerdoDetalle[];
  documentosObj: Documento[];
  periodo: PeriodoI
  tipoProceso: GeneralI
  acuerdoDuracion: { id:  number, duracion: string, periodo: string },
}

export interface TipoAcuerdoI {
  idTipoAcuerdo: number,
  nombre: string
  puntuacion: number
}
export interface TrackingI {
  idTraking: number,
  nombre: string,
}

export interface AcuerdoDetalle {
  idAcuerdoDetalle: number;
  idAcuerdo: number;
  idMeta: number;
  metaObj: Meta;
  calificacion: number;
  documentosObj: Documento
  observaciones?:string
}

export interface Meta {
  idMeta: number;
  idMedio: number;
  medioVerificacionObj: any;
  nombre: string;
  valor: number;
  isTranversal: boolean;
  metaPoa: any;
}

export interface Documento {
  idDocumento: number;
  nombre: string;
  enlace: string;
  idAcuerdo: number;
  idAcuerdoDetalle: number;
  idMeta: number;
  idProtocolo: number;
  idMinuta: number;
  fecha: string;
}

export interface postCommentI {
  acuerdoId: number,
  descripcion: string,
}

export interface commentsI {
  id: number
  creadoEn: string
  descripcion: string
  creadoPorPersona: string
  creadoPorUsuario: string
}

export interface MinutaAsistenciaI {
  idColaborador: number;
  ausente: boolean;
  motivoAusencia: string | null;
}

export interface MinutaI {
  desarrollo: string;
  conclusion: string;
  agendaReunion: string;
  periodoAcuerdoId: number;
  supervisor?: CollaboratorsGetI;
  periodoAcuerdo?: periodProcessGetI;
  supervisorId: number;
  minutaAsistencia: MinutaAsistenciaI[];
}
