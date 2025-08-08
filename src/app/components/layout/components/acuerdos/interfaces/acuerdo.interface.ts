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
  flujoObj: { idFlujo: number, nombre: string },
  puntos: number
  comentarios: commentsI[]
  detalles: AcuerdoDetalle[];
  documentosObj: Documento[];
  periodo: PeriodoI
  tipoProceso: GeneralI
  acuerdoDuracion: { id: number, duracion: string, periodo: string },
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
  observaciones?: string
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

export interface DocumentoMinuta {
  idDocumento: number,
  nombre: string,
  enlace: string
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

export interface MinutaAsistenciaGetI {
  id: number
  colaborador: number;
  ausente: boolean;
  motivoAusencia: string | null;
}

export interface MinutaAsistenciaTemplateGetI {
  id: number
  colaborador: CollaboratorsGetI;
  ausente: boolean;
  motivoAusencia: string | null;
}


export interface MinutaGetI {
  agendaReunion: string
  conclusion: string
  desarrollo: string
  documentos: DocumentoMinuta[]
  esUnaEvaluacionCompentencia: boolean
  id: number
  minutaAsistencia: MinutaAsistenciaGetI
  periodo: PeriodoI
  periodoAcuerdo: periodProcessGetI
  supervisor: CollaboratorsGetI
  unidadOrg: string
  fechaCreacion: Date
}

export interface MinutaI {
  desarrollo: string;
  conclusion: string;
  agendaReunion: string;
  periodoId: number
  periodoAcuerdoId: number;
  supervisor?: CollaboratorsGetI;
  periodoAcuerdo?: periodProcessGetI;
  supervisorId: number;
  esUnaEvaluacionCompentencia: boolean
  minutaAsistencia: MinutaAsistenciaI[];
  unidadOrg: string
}

export interface MinutaCollaboratorTemplateI {
  nombre: string
  apellido: string
  cargo: string
  motivoAusencia: string
}


