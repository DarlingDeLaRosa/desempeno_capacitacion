import { PeriodI } from '../../mantenimiento/mantenimiento-options/periodos/interfaces/periodo.interface';
import { behaviorsI } from '../../mantenimiento/mantenimiento-options/grados/interfaces/grados.interfaces';
import { CollaboratorsGetI } from '../../mantenimiento/mantenimiento-options/colaboradores/interfaces/colaboradores.interface';
import { CompetencyI } from '../../mantenimiento/mantenimiento-options/competencias/interfaces/competencias.interfaces';

export interface EvaluationCompetencyGetI {
    colaborador: CollaboratorsGetI
    evaluacionCompetencia: EvaluationBehaviorsI[]
    gradoCompetencia: gradeCompetencyI
    periodo: PeriodI
    id: number
}

export interface EvaluationCompetencyI {
    id: number,
    idColaborador: number,
    periodoId: number,
    evaluacionCompetenciasDetalles: [
        {
            id: number,
            comportamientoId: number,
            calificacionComportamientoId: number
        }
    ]
}

export interface EvaluationBehaviorsI {
    calificacionComportamiento: behaviorCalificationI
    comportamiento: behaviorsI
    id: number
}

export interface behaviorCalificationI {
    id: number
    nombre: string
    puntos: number
}

export interface gradeCompetencyI {
    competencia: CompetencyI
    descripcion: string
    id: number
}
