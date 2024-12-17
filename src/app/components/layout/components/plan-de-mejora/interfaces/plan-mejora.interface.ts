import { GeneralI } from '../../../../../helpers/intranet/intranet.interface';
import { CollaboratorsGetI } from '../../mantenimiento/mantenimiento-options/colaboradores/interfaces/colaboradores.interface';

export interface RecommendDetailsI{
  id?:number,
  idCategoriaRecomendacion: number,
  categoriaRecomendacion?:GeneralI,
  que: {
    nombre: string; // Cambiado de `string` a un objeto con `nombre`
  };
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

export interface CategoriaRecomendacionesI {
  id: number;
  nombre: string;
  planMejoraRecomendaciones: GeneralI[];
}

export interface RecomendacionesPlanMejoraI {
  id: number;
  nombre:string;
  categoria: GeneralI;
  colaboradores: CollaboratorsGetI[];
}
