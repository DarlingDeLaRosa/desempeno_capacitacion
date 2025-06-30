import { PeriodI } from '../../mantenimiento/mantenimiento-options/periodos/interfaces/periodo.interface';
import { GradesGetI, behaviorsI } from '../../mantenimiento/mantenimiento-options/grados/interfaces/grados.interfaces';
import { CollaboratorsGetI } from '../../mantenimiento/mantenimiento-options/colaboradores/interfaces/colaboradores.interface';
import { CompetencyI } from '../../mantenimiento/mantenimiento-options/competencias/interfaces/competencias.interfaces';
import { GradesTypeGetI } from '../../mantenimiento/mantenimiento-options/grados/interfaces/tiposGrados.interface';

export interface EvaluationCompetencyGetI {
    colaborador: CollaboratorsGetI
    evaluacionCompetenciasDetalles: EvaluationBehaviorsI[]
    gradoCompetencia: gradeCompetencyI
    periodo: PeriodI
    id: number
}

export interface EvaluationCompetencyI {
    id: number,
    idColaborador: number,
    periodoId: number,
    gradoId: number
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

export interface getEvaluationCompetencyByIdI {
    colaborador: CollaboratorsGetI
    evaluacionCompetencia: EvaluationCompetencyByIdI[]
    idColaborador: number
}

export interface EvaluationCompetencyByIdI {
    id: number
    periodo: PeriodI
    evaluacionCompetenciasDetalles: EvaluationBehaviorsI[]
    grado: {
        id: number
        tipoGrado: GradesTypeGetI
        descripcion: string
        competencia: {
            id: number
            nombre: string
            descripcion: string
        }
    }
}

export interface EvaluationCompetencyTestI {
    competenciaObj: CompetencyI
    comportamientosObj: behaviorsI[]
    descripcion: string
    idGrado: number
    tipoGradoObj: GradesTypeGetI
}

export interface evaluationAgreementCalificationI{
    calificacionComportamiento: {id: number, nombre: string, puntos: number}
    comportamiento: behaviorsI
}