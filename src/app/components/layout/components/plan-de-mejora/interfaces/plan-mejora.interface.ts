import { GeneralI } from '../../../../../helpers/intranet/intranet.interface';

export interface RecommendDetailsI{
  id?:number,
  idCategoriaRecomendacion: number,
  categoriaRecomendacion?:GeneralI,
  que: string,
  como: string,
  porque: string,
  comienzoId: number;
  comienzo?: GeneralI;
}

export interface PlanMejoraI {
  id?: number;
  periodoId: number;
  idColaborador: number;
  accionMotivacional: string;
  aspectoDesempeno: string;
  comentario: string;
  areaMejoras: GeneralI[];
  puntosFuertes: GeneralI[];
  recomendacionesFormativas: RecommendDetailsI[];
}
