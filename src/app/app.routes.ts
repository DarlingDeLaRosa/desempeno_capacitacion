import { Routes } from '@angular/router';
import { LoginComponent } from './components/auth/login/login.component';
import { LayoutComponent } from './components/layout/layout.component';
import { EvalucionCompetenciasComponent } from './components/layout/components/evaluacion-competencias/pages/competencias/evalucion-competencias.component';
import { MantenimientoComponent } from './components/layout/components/mantenimiento/mantenimiento.component';
import { PeriodosComponent } from './components/layout/components/mantenimiento/mantenimiento-options/periodos/periodos.component';
import { CompetenciasComponent } from './components/layout/components/mantenimiento/mantenimiento-options/competencias/competencias.component';
import { GradosComponent } from './components/layout/components/mantenimiento/mantenimiento-options/grados/grados.component';
import { AsignacionCompetenciasComponent } from './components/layout/components/mantenimiento/mantenimiento-options/asignacion-competencias/asignacion-competencias.component';
import { ColaboradoresComponent } from './components/layout/components/mantenimiento/mantenimiento-options/colaboradores/colaboradores.component';
import { EvaluacionPersonaComponent } from './components/layout/components/evaluacion-competencias/pages/evaluacion-persona/evaluacion-persona.component';
import { CompetenciasOuletComponent } from './components/layout/components/evaluacion-competencias/competencias-oultet.component';
import { PlanMejoraOuletComponent } from './components/layout/components/plan-de-mejora/plandemejora-oulet.component';
import { PlanMejoraListComponent } from './components/layout/components/plan-de-mejora/pages/plan-mejora-list/plan-mejora-list.component';
import { PlanMejoraResultadoComponent } from './components/layout/components/plan-de-mejora/pages/plan-mejora-resultado/plan-mejora-resultado.component';
import { PlanMejoraFormularioComponent } from './components/layout/components/plan-de-mejora/pages/plan-mejora-formulario/plan-mejora-formulario.component';
import { CursosComponent } from './components/layout/components/cursos/cursos-oulet.component';
import { CursosMantenimientoComponent } from './components/layout/components/mantenimiento/mantenimiento-options/cursos/cursos.component';
import { CursosListadoComponent } from './components/layout/components/cursos/pages/cursos-listado/cursos-listado.component';
import CursosTableroComponent from './components/layout/components/cursos/pages/cursos-tablero/cursos-tablero.component';
import { CursosMiembrosComponent } from './components/layout/components/cursos/pages/cursos-miembros/cursos-miembros.component';
import { AcuerdosComponent } from './components/layout/components/acuerdos/acuerdos.component';
import { AcuerdoDesempenioComponent } from './components/layout/components/acuerdos/acuerdo-desempenio/acuerdo-desempenio.component';
import { MiscursosComponent } from './components/layout/components/cursos/modals/miscursos/miscursos.component';
import { MetasComponent } from './components/layout/components/mantenimiento/mantenimiento-options/metas/metas.component';
import { AsignacionMetasComponent } from './components/layout/components/mantenimiento/mantenimiento-options/asignacion-metas/asignacion-metas.component';
import { AsignacionAcuerdoComponent } from './components/layout/components/mantenimiento/mantenimiento-options/asignacion-acuerdo/asignacion-acuerdo.component';
import { ProtocolosComponent } from './components/layout/components/mantenimiento/mantenimiento-options/protocolos/protocolos.component';
import { SupervisorGuard } from './guards/supervisor.guard';
import { EncargadoGuard } from './guards/encargado.guard';
import { AcuerdoEditarComponent } from './components/layout/components/acuerdos/acuerdo-desempenio/acuerdo-editar/acuerdo-editar.component';
import { MiAcuerdoComponent } from './components/layout/components/acuerdos/pages/mi-acuerdo/mi-acuerdo.component';
import { AcuerdoEvaluacionComponent } from './components/layout/components/acuerdos/pages/acuerdo-evaluacion/acuerdo-evaluacion.component';
import { PeriodoProcesosComponent } from './components/layout/components/mantenimiento/mantenimiento-options/periodo-procesos/periodo-procesos.component';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },

  {
    path: 'layout',
    component: LayoutComponent,
    children: [
      {
        path: 'acuerdos',
        component: AcuerdosComponent,
        children: [
          {
            path: '',
            component: AcuerdoDesempenioComponent,
            outlet: 'acuerdos'
          },
          {
            path: 'miacuerdo',
            component: MiAcuerdoComponent,
            outlet: 'acuerdos'
          },
          {
            path: 'editar/:id',
            component: AcuerdoEditarComponent,
            outlet: 'acuerdos'
          },
          {
            path: 'evaluacion/:id',
            component: AcuerdoEvaluacionComponent,
            outlet: 'acuerdos'
          },
        ]
      },
      {
        path: 'cursos',
        component: CursosComponent,
        children: [
          {
            path: '',
            component: CursosTableroComponent,
            outlet: 'cursos'
          },
          {
            path: 'listado',
            component: CursosListadoComponent,
            canActivate: [EncargadoGuard],
            outlet: 'cursos'
          },
          {
            path: 'miembros',
            component: CursosMiembrosComponent,
            canActivate: [SupervisorGuard],
            outlet: 'cursos'
          },
        ]
      },
      {

        path: 'plan-de-mejora',
        component: PlanMejoraOuletComponent,
        children: [
          {
            path: '',
            component: PlanMejoraListComponent,
            outlet: 'plan-de-mejora'
          },
          {
            path: 'resultado',
            component: PlanMejoraResultadoComponent,
            outlet: 'plan-de-mejora'
          },
          {
            path: 'formulario/:id',
            component: PlanMejoraFormularioComponent,
            outlet: 'plan-de-mejora'
          }
        ]
      },
      {
        path: 'evaluacion-competencias',
        component: CompetenciasOuletComponent,
        children: [
          {
            path: '',
            component: EvalucionCompetenciasComponent
          },
          {
            path: 'evaluacion-competencia-persona',
            component: EvaluacionPersonaComponent
          },
        ]
      },
      {
        path: 'mantenimiento',
        component: MantenimientoComponent,
        children: [
          {
            path: 'periodos',
            component: PeriodosComponent,
            outlet: 'mantenimiento'
          },
          {
            path: 'periodos-procesos',
            component: PeriodoProcesosComponent,
            outlet: 'mantenimiento'
          },
          {
            path: 'cursos',
            component: CursosMantenimientoComponent,
            outlet: 'mantenimiento'
          },
          {
            path: 'competencias',
            component: CompetenciasComponent,
            outlet: 'mantenimiento'
          },
          {
            path: 'grados',
            component: GradosComponent,
            outlet: 'mantenimiento'
          },
          {
            path: 'asignacion-competencias',
            component: AsignacionCompetenciasComponent,
            outlet: 'mantenimiento'
          },
          {
            path: 'colaboradores',
            component: ColaboradoresComponent,
            outlet: 'mantenimiento'
          },
          {
            path: 'metas',
            component: MetasComponent,
            outlet: 'mantenimiento'
          },
          {
            path: 'asignacion-metas',
            component: AsignacionMetasComponent,
            outlet: 'mantenimiento'
          },
          {
            path: 'asignacion-acuerdos',
            component: AsignacionAcuerdoComponent,
            outlet: 'mantenimiento'
          },
          {
            path: 'protocolos',
            component: ProtocolosComponent,
            outlet: 'mantenimiento'
          }
        ]
      }
    ]
  }

];
